const { execCommand } = require('./utils/execCommand');
const fsp = require('fs/promises');
const {
  ALLOW_MODIFY_OTHERS,
  LINT_WITH_PARALLEL,
  COMPlIE_WITH_PARALLEL,
  DEPLOY_WITH_PARALLEL,
  ONLY_ONE_PACKAGE_PER_PR,
} = require('./env');
const { lint, complie, deploy } = require('./lifecycle');
const { getPackage } = require('./packageInfo/getPackage');
const { getPackageRoot } = require('./packageInfo/getPackageRoot');
const {
  exitWithMessage,
  erroredPackagesToMsg,
  unsupportedFileToMsg,
  toManyPackagesToMsg,
} = require('./error');
const { customCheck } = require('./customCheck');

const getChangedFile = async () => {
  const fileStr = await execCommand('git diff --name-only origin/main...HEAD');
  return fileStr
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean);
};

const createLibraryStore = () => {
  const store = new Map();
  const noPackageFiles = [];

  return {
    process,
    getAllNoPackageFile,
    getAllPackages,
  };

  async function process(pathname) {
    const packageRoot = getPackageRoot(pathname);
    if (!packageRoot) {
      noPackageFiles.push(pathname);
      return;
    }
    const existPackage = store.get(packageRoot);
    if (existPackage) {
      existPackage.changedFiles = existPackage.changedFiles || [];
      existPackage.changedFiles.push(pathname);
      return existPackage;
    }
    const package = {};
    store.set(packageRoot, package);
    const info = await getPackage(packageRoot).catch((e) => {
      return {
        packageRoot,
        error: e,
      };
    });
    Object.assign(package, info);
    package.changedFiles = package.changedFiles || [];
    package.changedFiles.push(pathname);
    return package;
  }

  function getAllPackages() {
    return Array.from(store.values());
  }
  function getAllNoPackageFile() {
    return noPackageFiles;
  }
};

const processPackageWithParallelFlag = (fn, packages, isParallel) => {
  if (isParallel) {
    return Promise.all(packages.map((p) => processPackage(p)));
  } else {
    return packages.reduce(async (acc, p) => {
      const prevPackage = await acc;
      if (prevPackage.error) return prevPackage;
      return processPackage(p);
    }, Promise.resolve({ error: null }));
  }

  async function processPackage(package) {
    try {
      if (package.error) throw package.error;
      await fn(package);
      return package;
    } catch (e) {
      package.error = e;
      return package;
    }
  }
};

const processPackagesErrors = async (erroredPackages) => {
  if (erroredPackages.length > 0)
    await exitWithMessage(erroredPackagesToMsg(erroredPackages));
};

const main = async () => {
  const changedFiles = await getChangedFile();
  if (changedFiles.length === 0) return;
  const store = createLibraryStore();
  await Promise.all(changedFiles.map((filename) => store.process(filename)));
  const packages = store.getAllPackages();
  const noPackageFiles = store.getAllNoPackageFile();
  const getValidPackages = () => packages.filter((p) => !p.error);
  const getErroredPackages = () => packages.filter((p) => !!p.error);

  if (noPackageFiles.length > 0) {
    if (ALLOW_MODIFY_OTHERS === 'true') {
      console.warn(
        '本分支修改了非依赖库文件，ls:\n',
        noPackageFiles.join('\n'),
      );
    } else {
      return exitWithMessage(unsupportedFileToMsg(noPackageFiles));
    }
  }

  await processPackagesErrors(getErroredPackages());
  const validPackages = getValidPackages();

  if (ONLY_ONE_PACKAGE_PER_PR === 'true' && validPackages.length > 1) {
    await exitWithMessage(toManyPackagesToMsg(validPackages));
  }

  // custom check for temp
  await customCheck({
    packages,
    exitWithMessage,
  });

  // lint
  await processPackageWithParallelFlag(
    lint,
    getValidPackages(),
    LINT_WITH_PARALLEL === 'true',
  );
  await processPackagesErrors(getErroredPackages());

  // comlie
  await processPackageWithParallelFlag(
    complie,
    getValidPackages(),
    COMPlIE_WITH_PARALLEL === 'true',
  );
  await processPackagesErrors(getErroredPackages());

  await fsp.mkdir('dist');
  // deploy
  await processPackageWithParallelFlag(
    deploy,
    getValidPackages(),
    DEPLOY_WITH_PARALLEL === 'true',
  );
  await processPackagesErrors(getErroredPackages());
};

main();

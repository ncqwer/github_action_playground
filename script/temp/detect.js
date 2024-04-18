const { execCommand } = require('./utils/execCommand');
const fsp = require('fs/promises');
const { TEMP_FILE } = require('./env');
const { getPackage } = require('./packageInfo/getPackage');
const { getPackageRoot } = require('./packageInfo/getPackageRoot');

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

const main = async () => {
  const changedFiles = await getChangedFile();
  if (changedFiles.length === 0) return;
  const store = createLibraryStore();
  await Promise.all(changedFiles.map((filename) => store.process(filename)));
  const packages = store.getAllPackages();
  const noPackageFiles = store.getAllNoPackageFile();

  await fsp.writeFile(
    TEMP_FILE,
    JSON.stringify({
      packages,
      noPackageFiles,
      needJAVA: packages.filter((v) => v.type !== 'f').length > 0,
    }),
    'utf-8',
  );
};

main();

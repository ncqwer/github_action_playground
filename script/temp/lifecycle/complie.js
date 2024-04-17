const fsp = require('fs/promises');
const path = require('path');
const { execCommands, execCommand } = require('../utils/execCommand');
const { AUTO_ADJUST_RESOLUTION } = require('../env');

const feBuild = async (package) => {
  const { cwd, nextVersion, packageInfo } = package;
  packageInfo.version = nextVersion;
  if (
    packageInfo &&
    !packageInfo.resolutions &&
    AUTO_ADJUST_RESOLUTION === 'true'
  ) {
    packageInfo.resolutions = {
      globby: '9.2.0',
    };
  }

  await fsp.writeFile(
    path.resolve(cwd, 'package.json'),
    JSON.stringify(packageInfo, null, 2),
    'utf-8',
  );

  await execCommands(['npm install', 'npm run build'], {
    cwd,
  });
  await execCommand('npm run usage', {
    throwWhenStderr: false,
    cwd,
  });
};

const beBuild = async ({ cwd }) => {
  await execCommand('mvn clean package', {
    cwd,
  });
};

const complie = async (package) => {
  if (package.type === 'f') return feBuild(package);
  return beBuild(package);
};

module.exports = {
  complie,
};

// complie({
//   type: 'f',
//   cwd: '/Users/hanshijie/project/cloud-ui-materials/packages/cw/cw_wework_sdk',
//   packageInfo: {
//     name: 'cw_wework_sdk',
//     title: '企业微信sdk',
//     description: '',
//     version: '0.1.0',
//     main: './index.js',
//     author: '',
//     repository: '',
//     homepage: '',
//     license: 'MIT',
//     keywords: ['lcap', 'material', 'component'],
//     scripts: {
//       dev: 'vue-cli-service doc --port 9090',
//       'build:theme': 'vue-cli-service library-build --dest dist-theme',
//       'build:doc': 'vue-cli-service doc-build',
//       build: 'npm run build:theme',
//       usage: 'lcap usage',
//       deploy: 'lcap deploy dist-theme',
//       prepublishOnly: 'lcap publish',
//       release: 'lcap publish',
//     },
//     vuePlugins: {},
//     babel: {},
//     vusion: {
//       ui: 'cloud-ui.vusion',
//     },
//     lcapVersion: '0.3.0',
//     devDependencies: {
//       '@vue/cli-service': '^4.4.1',
//       'core-js': '^3.6.5',
//       'vue-loader': '15.9.8',
//       'vue-cli-plugin-vusion': '0.14.2-beta',
//       'cloud-ui.vusion': '^0.11.20',
//       vue: '^2.6.12',
//     },
//     peerDependencies: {
//       'cloud-ui.vusion': '^0.11.20',
//       vue: '^2.6.12',
//     },
//     vetur: {
//       tags: './vetur/tags.json',
//       attributes: './vetur/attributes.json',
//     },
//     template: {
//       inited: true,
//     },
//   },
//   packageName: 'cw_wework_sdk',
//   nextVersion: '0.1.1',
// }).catch((e) => {
//   console.log('hh', e);
// });

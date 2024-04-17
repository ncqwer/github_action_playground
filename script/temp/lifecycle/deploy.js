const path = require('path');
const { glob } = require('glob');
const { execCommand } = require('../utils/execCommand');

const deploy = async ({ cwd, packageName }) => {
  const [zipFile] = await glob(['target/*.zip', '*.zip'], { cwd });
  const [docxFile] = await glob('依赖库使用说明文档.docx', { cwd });
  if (zipFile) {
    await execCommand(
      `cp ${path.resolve(cwd, zipFile)} dist/${zipFile.replace(
        /^target\//,
        '',
      )}`,
    );
  } else {
    throw new Error('不存在指定的zip');
  }
  if (docxFile)
    await execCommand(
      `cp ${path.resolve(cwd, docxFile)} dist/${packageName}_${docxFile}`,
    );
};

module.exports = {
  deploy,
};

deploy({
  packageName: 'aaa',
  cwd: '/Users/hanshijie/myproject/git_try/test_1',
});

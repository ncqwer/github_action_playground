const path = require('path');
const { glob } = require('glob');
const { execCommand } = require('../utils/execCommand');

const deploy = async ({ cwd, packageName }) => {
  const [zipFile] = await glob('*.zip', { cwd });
  const [docxFile] = await glob('依赖库使用说明文档.docx', { cwd });
  if (zipFile) {
    await execCommand(`cp ${path.resolve(cwd, zipFile)} dist/${zipFile}`);
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

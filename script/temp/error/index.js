const fetch = require('node-fetch');
const path = require('path');
const fsp = require('fs/promises');

const {
  PULL_REQUEST_ID,
  GITHUB_TOKEN,
  GITHUB_REPOSITORY,
  BRANCH_NAME,
} = require('../env');

const sendMessage = async (message) => {
  // await fsp.writeFile('test.md', message, 'utf-8');
  // return;
  const url = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${PULL_REQUEST_ID}/comments`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.raw+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      body: message,
    }),
  }).then((v) => v.json());
};

const exitWithMessage = async (message) => {
  try {
    await sendMessage(message);
  } catch (e) {
    console.error('IMPORTANT: exitWithMessage ~ e:', e);
  } finally {
    process.exit(1);
  }
};

const erroredPackagesToMsg = (packages) => {
  const str = packages.map(toError).join('\n\n');
  return str;
  function toError({ error, packageName, packageRoot }) {
    const _errorMsg = error.message || `${error}`;
    const errorMsg = _errorMsg.split('\n').slice(-100).join('\n');
    const packgeRootURL = `https://github.com/${GITHUB_REPOSITORY}/tree/${BRANCH_NAME}/${packageRoot}`;
    const msg = `[${
      packageName || packageRoot
    }](${packgeRootURL})存在错误：\n\`\`\`bash\n${errorMsg}\n\`\`\``;
    return msg;
  }
};

const prettyFileTree = (filenames) => {
  const treeObj = {};
  filenames.forEach((filename) => {
    const tmp = filename.split(path.sep);
    tmp.reduce((acc, value, idx) => {
      const isLast = idx === tmp.length - 1;
      if (isLast) {
        acc[value] = true;
        return acc;
      } else {
        acc[value] = acc[value] || {};
        return acc[value];
      }
    }, treeObj);
  });
  return generateFileTree(treeObj);

  function generateFileTree(obj, prefix = '') {
    let tree = '';
    const files = Object.entries(obj);

    files.forEach(([key, value], index) => {
      const isLast = index === files.length - 1;

      tree += `${prefix}${isLast ? '└──' : '├──'} ${key}\n`;

      if (typeof value === 'object') {
        const newPrefix = `${prefix}${isLast ? '   ' : '│  '}`;

        tree += generateFileTree(value, newPrefix);
      }
    });

    return tree;
  }
};

const unsupportedFileToMsg = (filenames) => {
  const str = `意外修改了以下文件，这些文件目前无法被当前用户修改:\n\`\`\`bash\n${prettyFileTree(
    filenames,
  )}\n\`\`\``;
  return str;
};

const toManyPackagesToMsg = (packages) => {
  const str = packages.map(toError).join('\n\n');
  return `存在多处package修改:\n\n${str}`;

  function toError({ packageName, cwd, changedFiles }) {
    const packgeRootURL = `https://github.com/${GITHUB_REPOSITORY}/tree/${BRANCH_NAME}/${cwd}`;
    const msg = `[${packageName}](${packgeRootURL})涉及的修改：\n\`\`\`bash\n${prettyFileTree(
      changedFiles,
    )}\n\`\`\``;
    return msg;
  }
};

module.exports = {
  exitWithMessage,
  erroredPackagesToMsg,
  unsupportedFileToMsg,
  toManyPackagesToMsg,
  sendMessage,
};

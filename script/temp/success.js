const { GITHUB_REPOSITORY, ARTIFACT_ID } = require('./env');
const { sendMessage } = require('./error');

const main = async () => {
  const url = `https://github.com/${GITHUB_REPOSITORY}/actions/artifacts/${ARTIFACT_ID}`;
  sendMessage(`[点击此处获得编译产物](${url})`);
};

main();

const { GITHUB_REPOSITORY, ACTION_ID } = require('./env');
const { sendMessage } = require('./error');

const main = async () => {
  const url = `https://api.github.com/${GITHUB_REPOSITORY}/actions/runs/${ACTION_ID}`;
  sendMessage(`[点击此处获得编译产物](${url})`);
};

main();

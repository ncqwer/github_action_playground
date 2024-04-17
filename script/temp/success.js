const { GITHUB_REPOSITORY, ACTION_ID } = require('./env');
const { sendMessage } = require('./error');

const main = async () => {
  const url = `https://github.com/${GITHUB_REPOSITORY}/actions/runs/${ACTION_ID}`;
  await sendMessage(`[点击此处获得编译产物](${url})`);
};

main();

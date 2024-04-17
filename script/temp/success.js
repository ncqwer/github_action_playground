const { GITHUB_REPOSITORY, ACTION_ID } = require('./env');
const { sendMessage } = require('./error');

const main = async () => {
  try {
    const url = `https://github.com/${GITHUB_REPOSITORY}/actions/runs/${ACTION_ID}`;
    const data = await sendMessage(`[点击此处获得编译产物](${url})`);
    console.log('🚀 ~ file: success.js:9 ~ main ~ data:', data);
  } catch (e) {
    console.log('🚀 ~ file: success.js:10 ~ main ~ e:', e);
  }
};

main();

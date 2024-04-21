const { execCommand } = require('./script/temp/utils/execCommand');

const main = async () => {
  await execCommand('git pull && git push --force-with-lease');
};

main.catch((e) => {
  console.log(e);
});

const { exec } = require('child_process');
const merge = require('lodash.merge');

// 使用git命令获取提交信息

// 使用git命令获取提交信息，使用指定的格式化字符串输出

const titleReg = /^(\S+?)(?:\((\S+)\))?\s*[\:\：](.*)/g;
const breakchangeReg = /^BREAKING CHANGE\s*[\:\：]\s*(\S.*)/g;

const main = async () => {
  const commitsRaw = await new Promise((res, rej) => {
    exec(
      `git log --format===='%n%H;%h;%an;%ae%n%B' main..HEAD`,
      (err, stdout, stderr) => {
        if (err) {
          rej(new Error(e.message));
          return;
        }
        if (stderr) {
          rej(new Error(stderr));
          return;
        }
        res(stdout);
      },
    );
  });
  const tmpResult = {};
  const revertCommitMap = {};
  commitsRaw.split('===').forEach((commitStr) => {
    if (!commitStr) return;
    const lines = commitStr.split('\n');
    const [hash, shotHash, authorName, authorEmail] = lines[1].split(';');
    if (revertCommitMap[hash]) {
      // current commit has been reverted
      return;
    }
    lines.slice(2).forEach((_line) => {
      const line = _line.trim();
      const titleResult = titleReg.exec(line);
      const breakChangeResult = breakchangeReg.exec(line);
      let library_name = 'library_name from branch';
      if (titleResult) {
        const type = titleResult[1];
        library_name = titleResult[2];
        const subject = titleResult[3];
        if (type === 'revert') {
          revertCommitMap[library_name] = true;
        }
        if (isValidType(type) && !!library_name) {
          merge(tmpResult, {
            [library_name]: {
              [type]: [
                {
                  subject,
                  hash,
                  shotHash,
                  authorName,
                  authorEmail,
                },
              ],
            },
          });
        }
      }
      if (breakChangeResult) {
        const breakingChange = breakChangeResult[1];
        if (breakingChange) {
          merge(tmpResult, {
            [library_name]: {
              breakingChange: [
                {
                  breakingChange,
                  authorName,
                  authorEmail,
                },
              ],
            },
          });
        }
      }
    });
  });

  console.log(tmpResult);
};

const isValidType = (type) => {
  return !!{
    fix: true,
    feat: true,
  }[type];
};

main().catch((e) => {
  console.error(e);
});

const { exec } = require('child_process');
const fsp = require('fs').promises;
const mergewith = require('lodash.mergewith');

const titleReg = /^(\S+?)(?:\((\S+)\))?\s*[\:\：](.*)/g;
const breakchangeReg = /^BREAKING CHANGE\s*[\:\：]\s*(\S.*)/g;

const repoCommitURL = 'http://github.com/commit/';
const homepageURL = 'https://github.com/';

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
        if (titleResult[2]) library_name = titleResult[2];
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
                  subject: breakingChange,
                  authorName,
                  authorEmail,
                  hash,
                  shotHash,
                },
              ],
            },
          });
        }
      }
    });
  });

  const md = genChangeLog(tmpResult['library_name from branch']);
  await fsp.writeFile('./CHANGELLOG.md', md, { encoding: 'utf-8' });
};

const genChangeLog = ({ feat, fix, breakingChange }) => {
  let ans = '';
  //
  Object.entries({
    '✨Features': feat,
    '🐛Bug Fixes': fix,
    '🚨BREAKING CHANGES': breakingChange,
  }).forEach(([title, entries]) => {
    if (!entries) return;
    ans += `### ${title}\n`;

    entries.forEach(({ hash, shotHash, authorName, subject }) => {
      ans += `- [${shotHash}](${repoCommitURL}${hash}) Thanks [${authorName}](${homepageURL}${authorName}) ! - ${subject}\n`;
    });
    ans += '\n';
  });
  return ans;
};

main().catch((e) => {
  console.error(e);
});

const merge = (a, b) =>
  mergewith(a, b, (source, target) => {
    if (Array.isArray(source)) return source.concat(target);
  });

const isValidType = (type) => {
  return !!{
    fix: true,
    feat: true,
  }[type];
};

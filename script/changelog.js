const { exec } = require('child_process');
const fsp = require('fs').promises;
const path = require('path');
const mergewith = require('lodash.mergewith');

const titleReg = /^(\S+?)(?:\((\S+)\))?\s*[\:\：](.*)/g;
const breakchangeReg = /^BREAKING CHANGE\s*[\:\：]\s*(\S.*)/g;

const repoCommitURL = 'http://github.com/commit/';
const homepageURL = 'https://github.com/';
const taskURL =
  'https://projectmanage.netease-official.lcap.163yun.com/dashboard/TaskDetail?id=';

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
      let libraryName = 'libraryB';
      if (titleResult) {
        const type = titleResult[1];
        if (titleResult[2]) libraryName = titleResult[2];
        const subject = titleResult[3];
        if (type === 'revert') {
          revertCommitMap[libraryName] = true;
        }
        if (isValidType(type) && !!libraryName) {
          merge(tmpResult, {
            [libraryName]: {
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
            [libraryName]: {
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
  await writeChangeLog(tmpResult, '2656521174974208');
};

const isPackageChangeLogExist = async (libraryName) => {
  const [prefix] = libraryName.split(/[\-\_]/);

  const targetPackagesDir = path.join(
    '.',
    'packages',
    prefix.length === libraryName.length ? '' : prefix,
    libraryName,
  );
  try {
    await access(targetPackagesDir, constants.R_OK | constants.W_OK);
    return targetPackagesDir;
  } catch {
    return null;
  }
};

const writeChangeLog = async (info, taskID) => {
  const rawInfos = await Promise.all(
    Object.entries(info).map(async ([libraryName, libraryInfo]) => {
      const targetPackagesDir = await isPackageChangeLogExist(libraryName);
      if (!targetPackagesDir) return null;
      const changelogFile = path.join(targetPackagesDir, 'CHANGELOG.md');
      const packageFile = path.join(targetPackagesDir, 'package.json');
      let content = '';
      try {
        content = await readFile(changelogFile, { encoding: 'utf8' });
      } catch {
        // do nothing;
      }
      const packageVersionContent = await readFile(packageFile, {
        encoding: 'utf8',
      });
      const version = JSON.parse(packageVersionContent).version;
      let ans = '';
      ans += `## ${version}\n`;
      ans += `Associated Task: [#${taskID.slice(0, 6)}](${taskURL}${taskID})\n`;
      ans += genChangeLog(libraryInfo, taskID);
      ans += '\n\n';
      ans += content;

      await fsp.writeFile(changelogFile, ans, 'utf-8');
      return [libraryName, ans];
    }),
  );
  const realInfos = rawInfos.filter(Boolean);

  let ans = '';
  realInfos.forEach(([libraryName, content]) => {
    ans += `## ${libraryName}\n`;
    ans += content;
    ans += '\n\n';
  });
  console.log(ans);
};

const genChangeLog = ({ feat, fix, breakingChange }, taskID) => {
  let ans = '';
  Object.entries({
    '✨Features': feat,
    '🐛Bug Fixes': fix,
    '🚨BREAKING CHANGES': breakingChange,
  }).forEach(([title, entries]) => {
    if (!entries) return;
    ans += `### ${title}\n`;
    ans += `Associated Task: [#${taskID.slice(0, 6)}](${taskURL}${taskID})\n`;

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

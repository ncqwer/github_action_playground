const ALLOW_MODIFY_OTHERS = process.env.ALLOW_MODIFY_OTHERS || 'true'; // 是否允许配置非依赖库文件

const LINT_WITH_PARALLEL = process.env.LINT_WITH_PARALLEL || 'true'; // lint parallel
const COMPlIE_WITH_PARALLEL = process.env.BUILD_WITH_PARALLEL || 'true'; // complie parallel
const DEPLOY_WITH_PARALLEL = process.env.UPLOAD_WITH_PARALLEL || 'true'; // deploy parallel
const AUTO_ADJUST_RESOLUTION = process.env.AUTO_ADJUST_RESOLUTION || 'true'; // fix globby error

const ONLY_ONE_PACKAGE_PER_PR = process.env.ONLY_ONE_PACKAGE_PER_PR || 'false'; // 是否组织一个pr中修改多个package

const HEAD_BRANCH_NAME =
  process.env.HEAD_BRANCH_NAME || 'Task(libraryB)-23234234-hsj-234324';
const GITHUB_REPOSITORY =
  process.env.GITHUB_REPOSITORY || 'ncqwer/github_action_playground';
const HEAD_REPOSITORY =
  process.env.HEAD_REPOSITORY || 'ncqwer/github_action_playground';
const PULL_REQUEST_ID = process.env.PULL_REQUEST_ID || '9';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const ACTION_ID = process.env.ACTION_ID || '8655960510';

const ARTIFACT_ID = process.env.ARTIFACT_ID || '1424334562';

const TEMP_FILE = process.env.TEMP_FILE || 'diff_stat.json';

const COMMIT_SHA = process.env.COMMIT_SHA || 'main';

module.exports = {
  ALLOW_MODIFY_OTHERS,
  LINT_WITH_PARALLEL,
  COMPlIE_WITH_PARALLEL,
  DEPLOY_WITH_PARALLEL,
  AUTO_ADJUST_RESOLUTION,
  GITHUB_REPOSITORY,
  HEAD_REPOSITORY,
  PULL_REQUEST_ID,
  GITHUB_TOKEN,
  HEAD_BRANCH_NAME,
  ONLY_ONE_PACKAGE_PER_PR,
  ACTION_ID,
  TEMP_FILE,
  ARTIFACT_ID,
  COMMIT_SHA,
};

const ALLOW_MODIFY_OTHERS = process.env.ALLOW_MODIFY_OTHERS || 'true'; // 是否允许配置非依赖库文件

const LINT_WITH_PARALLEL = process.env.LINT_WITH_PARALLEL || 'true'; // lint parallel
const COMPlIE_WITH_PARALLEL = process.env.BUILD_WITH_PARALLEL || 'true'; // complie parallel
const DEPLOY_WITH_PARALLEL = process.env.UPLOAD_WITH_PARALLEL || 'true'; // deploy parallel
const AUTO_ADJUST_RESOLUTION = process.env.AUTO_ADJUST_RESOLUTION || 'true'; // fix globby error

const ONLY_ONE_PACKAGE_PER_PR = process.env.ONLY_ONE_PACKAGE_PER_PR || 'false'; // 是否组织一个pr中修改多个package

const BRANCH_NAME =
  process.env.BRANCH_NAME || 'Task(libraryB)-23234234-hsj-234324';
const GITHUB_REPOSITORY =
  process.env.GITHUB_REPOSITORY || 'ncqwer/github_action_playground';
const PULL_REQUEST_ID = process.env.PULL_REQUEST_ID || '9';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const ACTION_ID = process.env.ACTION_ID || '8655960510';

module.exports = {
  ALLOW_MODIFY_OTHERS,
  LINT_WITH_PARALLEL,
  COMPlIE_WITH_PARALLEL,
  DEPLOY_WITH_PARALLEL,
  AUTO_ADJUST_RESOLUTION,
  GITHUB_REPOSITORY,
  PULL_REQUEST_ID,
  GITHUB_TOKEN,
  BRANCH_NAME,
  ONLY_ONE_PACKAGE_PER_PR,
  ACTION_ID,
};

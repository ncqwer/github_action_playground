const baseConfig = require('../config/tailwind.config.base');

module.exports = {
  ...baseConfig,
  content: (process.env.NODE_ENV === 'production'
    ? []
    : ['../packages/*/src/**/*.{html,js,ts,tsx,jsx}']
  ).concat([...baseConfig.content]),
};

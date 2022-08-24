const development = require('./config.dev');
const production = require('./config.prod');
const nodeEnv = process.env.NODE_ENV || 'development';
const configuration = {
    development,
    production,
};
module.exports = configuration[nodeEnv];

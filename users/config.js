const dotenv = require("dotenv");

// require and configure dotenv, will load vars in .env in PROCESS.ENV
dotenv.config();

const config = {
  dev: {
    baseUrl: "http://localhost"
  },
  production: {
    baseUrl: ""
  },
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  mysqlHost: process.env.MYSQL_HOST,
  mysqlLocalhost: process.env.MYSQL_LOCALHOST,
  mysqlDb: process.env.MYSQL_DB
};

const flattenedConfig = {
  ...config,
  ...config[process.env.PKI_STAGE]
};
module.exports.default = flattenedConfig;
module.exports.getEnvVars = () => flattenedConfig;

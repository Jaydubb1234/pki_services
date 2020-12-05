"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlDb = void 0;
var mysql = require("mysql-ssh");
var config_1 = require("../../config");
exports.mysqlDb = mysql.connect({
    host: config_1.default.mysqlHost,
    user: config_1.default.mysqlUser,
    password: config_1.default.mysqlPassword
}, {
    host: config_1.default.mysqlLocalhost,
    user: config_1.default.mysqlUser,
    password: config_1.default.mysqlPassword,
    database: config_1.default.mysqlDb
});
//# sourceMappingURL=db.js.map
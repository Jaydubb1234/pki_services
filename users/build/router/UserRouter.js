"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
var express_1 = require("express");
var db_1 = require("../config/db");
//import User from '../models/User';
var UserRouter = /** @class */ (function () {
    function UserRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    UserRouter.prototype.getUsers = function (req, res) {
        var lastId = req.body.lastId;
        var sqlQuery;
        lastId ?
            sqlQuery = "SELECT *\n          FROM wordpress.wp_users as u\n          INNER JOIN wordpress.wp_signups as su ON u.user_email = su.user_email\n          WHERE su.active = 1 AND u.ID < " + lastId + "\n          ORDER BY su.activated DESC\n          LIMIT 10"
            :
                sqlQuery = "SELECT *\n          FROM wordpress.wp_users as u\n          INNER JOIN wordpress.wp_signups as su ON u.user_email = su.user_email\n          WHERE su.active = 1\n          ORDER BY su.activated DESC\n          LIMIT 10";
        db_1.mysqlDb
            .then(function (client) {
            client.query(sqlQuery, function (err, results, fields) {
                if (err)
                    return res.status(500).json({ err: err });
                return res.status(200).json({
                    code: res.statusCode,
                    message: res.statusMessage,
                    datetime: new Date(),
                    data: results
                });
                db_1.mysqlDb.close();
            });
        })
            .catch(function (err) {
            console.error(err);
            throw new Error(err);
        });
    };
    UserRouter.prototype.getUser = function (req, res) {
        var username = req.params.username;
        db_1.mysqlDb
            .then(function (client) {
            client.query("SELECT * FROM wp_users WHERE user_nicename = ?", username, function (err, results, fields) {
                if (err)
                    return res.status(500).json({ err: err });
                return res.status(200).json({
                    code: res.statusCode,
                    message: "OK",
                    datetime: new Date(),
                    data: results
                });
                db_1.mysqlDb.close();
            });
        })
            .catch(function (err) {
            console.error(res.status(500).json({ err: err }));
            throw new Error(err);
        });
    };
    // public createUser(req: Request, res: Response): void {
    //   const { firstName, lastName, username, email, password } = req.body;
    //   const user = new User({
    //     firstName,
    //     lastName,
    //     username,
    //     email,
    //     password,
    //   });
    //   user
    //     .save()
    //     .then((data) => {
    //       res.status(201).json({ data });
    //     })
    //     .catch((error) => {
    //       res.status(500).json({ error });
    //     });
    // }
    // public update(req: Request, res: Response): void {
    //   const { username } = req.params;
    //   User.findOneAndUpdate({ username }, req.body)
    //     .then((data) => {
    //       res.status(200).json({ data });
    //     })
    //     .catch((error) => {
    //       res.status(500).json({ error });
    //     });
    // }
    UserRouter.prototype.deleteUser = function (req, res) {
        var username = req.params.username;
        db_1.mysqlDb
            .then(function (client) {
            client.query('DELETE FROM wp_users WHERE user_nicename = ?', username, function (err, results, fields) {
                if (err)
                    return res.status(500).json({ err: err });
                return res.status(200).json({
                    code: res.statusCode,
                    message: "OK",
                    datetime: new Date(),
                    data: results
                });
                db_1.mysqlDb.close();
            });
        })
            .catch(function (err) {
            res.status(500).json({ err: err });
            console.error(err);
            throw new Error(err);
            return;
        });
    };
    // set up our routes
    UserRouter.prototype.routes = function () {
        this.router.get('/', this.getUsers);
        this.router.get('/:username', this.getUser);
        // this.router.post('/', this.create);
        // this.router.put('/:username', this.update);
        this.router.delete('/:username', this.deleteUser);
    };
    return UserRouter;
}());
exports.UserRouter = UserRouter;
var userRoutes = new UserRouter();
userRoutes.routes();
exports.default = userRoutes.router;
//# sourceMappingURL=UserRouter.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("../config/db");
//import Post from '../models/Post';
var PostRouter = /** @class */ (function () {
    function PostRouter() {
        this.router = express_1.Router();
        this.routes();
    }
    //get all current user post and followers post
    PostRouter.prototype.getPosts = function (req, res) {
        var _a = req.body, currentUserId = _a.currentUserId, lastId = _a.lastId;
        var sqlQuery;
        lastId ?
            sqlQuery = "SELECT wp.post_content, wp.post_title, wp.ID as id, wp.comment_count, wp.post_date, wp.post_author, wp.post_modified,\n          u.display_name \n          FROM wordpresstest.wp_posts as wp\n          INNER JOIN wordpresstest.wp_users as u ON u.ID = wp.post_author\n          WHERE post_status = 'publish'\n          AND post_type = 'post'\n          AND post_author \n          IN (SELECT leader_id \n          FROM wordpresstest.wp_bp_follow \n          WHERE follower_id = " + currentUserId + ")\n          AND wp.ID < " + lastId + "\n          ORDER BY post_date DESC\n          LIMIT 10"
            :
                sqlQuery = "SELECT wp.post_content, wp.post_title, wp.ID as id, wp.comment_count, wp.post_date, wp.post_author, wp.post_modified,\n          u.display_name \n          FROM wordpresstest.wp_posts as wp\n          INNER JOIN wordpresstest.wp_users as u ON u.ID = wp.post_author\n          WHERE post_status = 'publish'\n          AND post_type = 'post'\n          AND post_author \n          IN (SELECT leader_id \n          FROM wordpresstest.wp_bp_follow \n          WHERE follower_id = " + currentUserId + ")\n          ORDER BY post_date DESC\n          LIMIT 10";
        queryToMysql(res, sqlQuery);
    };
    //get single post by author
    PostRouter.prototype.getPost = function (req, res) {
        var postAuthorId = req.params.postAuthorId;
        var sqlQuery = "SELECT * FROM wordpresstest.wp_posts WHERE post_author = " + postAuthorId;
        queryToMysql(res, sqlQuery);
    };
    // get all of the posts in the database
    // public all(req: Request, res: Response): void {
    //   Post.find()
    //     .then((data) => {
    //       res.status(200).json({ data });
    //     })
    //     .catch((error) => {
    //       res.json({ error });
    //     });
    // }
    // // get a single post by params of 'slug'
    // public one(req: Request, res: Response): void {
    //   const { slug } = req.params;
    //   Post.findOne({ slug })
    //     .then((data) => {
    //       res.status(200).json({ data });
    //     })
    //     .catch((error) => {
    //       res.status(500).json({ error });
    //     });
    // }
    // create a new post
    PostRouter.prototype.createPost = function (req, res) {
        var _a = req.body.postContent, body = _a.body, creationDate = _a.creationDate;
        var currentUserId = req.body.currentUserId;
        var sqlQuery = "INSERT INTO wordpresstest.wp_posts\n      (\n        post_author,\n        post_date,\n        post_date_gmt,\n        post_content,\n        post_title,\n        post_excerpt,\n        post_status,\n        comment_status,\n        ping_status,\n        post_password,\n        post_name,\n        to_ping,\n        pinged,\n        post_modified,\n        post_modified_gmt,\n        post_content_filtered,\n        post_parent,\n        guid,\n        menu_order,\n        post_type,\n        post_mime_type,\n        comment_count\n      )\n    VALUES\n      (\n        " + currentUserId + ",\n        '" + creationDate + "',\n        '" + creationDate + "',\n        '" + body + "',\n        'post_title',\n        '',\n        'publish',\n        'open',\n        'open',\n        '',\n        'post_name',\n        '',\n        '',\n        '" + creationDate + "',\n        '" + creationDate + "',\n        '',\n        '0',\n        'guid',\n        'menu_order',\n        'post',\n        '',\n        '0'\n      )";
        queryToMysql(res, sqlQuery);
    };
    // // update post by params of 'slug'
    // public update(req: Request, res: Response): void {
    //   const { slug } = req.body;
    //   Post.findOneAndUpdate({ slug }, req.body)
    //     .then((data) => {
    //       res.status(200).json({ data });
    //     })
    //     .catch((error) => {
    //       res.status(500).json({ error });
    //     });
    // }
    // // delete post by params of 'slug'
    // public delete(req: Request, res: Response): void {
    //   const { slug } = req.body;
    //   Post.findOneAndRemove({ slug })
    //     .then(() => {
    //       res.status(204).end();
    //     })
    //     .catch((error) => {
    //       res.status(500).json({ error });
    //     });
    // }
    // public function queryToMysql(res: Response, sqlQuery: String) {
    //   mysqlDb
    //     .then( (client) => {
    //       client.query(sqlQuery, 
    //       (err, results, fields) =>{
    //         if (err) return res.status(500).json({ err })
    //         return res.status(200).json(
    //           {
    //             code: res.statusCode,
    //             message: "OK",
    //             datetime: new Date(),
    //             data:results
    //           }
    //         );
    //         mysqlDb.close()
    //       })
    //     })
    //     .catch( (err) => {
    //       console.error(err)
    //       console.error(res.status(500).json({ err }))
    //       throw new Error(err)
    //     })
    // }
    PostRouter.prototype.routes = function () {
        this.router.post('/', this.getPosts);
        this.router.get('/:currentUserId', this.getPost);
        this.router.post('/create', this.createPost);
        // this.router.put('/:slug', this.update);
        // this.router.delete('/:slug', this.delete);
    };
    return PostRouter;
}());
exports.PostRouter = PostRouter;
function queryToMysql(res, sqlQuery) {
    db_1.mysqlDb
        .then(function (client) {
        client.query(sqlQuery, function (err, results, fields) {
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
        console.error(err);
        console.error(res.status(500).json({ err: err }));
        throw new Error(err);
    });
}
var postRoutes = new PostRouter();
postRoutes.routes();
exports.default = postRoutes.router;
//# sourceMappingURL=PostRouter.js.map
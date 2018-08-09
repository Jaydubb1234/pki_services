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
        console.log('lastId ', lastId);
        lastId ?
            sqlQuery = "SELECT wp.post_content, wp.post_title, wp.ID as id, wp.comment_count, wp.post_date, wp.post_author, wp.post_modified,\n            u.display_name \n          FROM wordpresstest.wp_posts as wp\n          INNER JOIN wordpresstest.wp_users as u ON u.ID = wp.post_author\n          WHERE post_status = 'publish'\n          AND post_type = 'post'\n          AND post_author \n          IN (SELECT leader_id \n          FROM wordpresstest.wp_bp_follow \n          WHERE follower_id = " + currentUserId + ")\n          AND wp.ID < " + lastId + "\n          ORDER BY post_date DESC\n          LIMIT 10"
            :
                sqlQuery = "SELECT wp.post_content, wp.post_title, wp.ID as id, wp.comment_count, wp.post_date, wp.post_author, wp.post_modified,\n            u.display_name \n          FROM wordpresstest.wp_posts as wp\n          INNER JOIN wordpresstest.wp_users as u ON u.ID = wp.post_author\n          WHERE post_status = 'publish'\n          AND post_type = 'post'\n          AND post_author \n          IN (SELECT leader_id \n          FROM wordpresstest.wp_bp_follow \n          WHERE follower_id = " + currentUserId + ")\n          ORDER BY post_date DESC\n          LIMIT 10";
        console.log('sqlQuery', sqlQuery);
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
    };
    //get single post by author
    PostRouter.prototype.getPost = function (req, res) {
        var postAuthorId = req.params.postAuthorId;
        var sqlQuery = "SELECT * FROM wordpresstest.wp_posts WHERE post_author = " + postAuthorId;
        db_1.mysqlDb
            .then(function (client) {
            client.query(sqlQuery, function (err, results, fields) {
                if (err)
                    return res.status(500).json({ err: err });
                console.log(res);
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
    // // create a new post
    // public create(req: Request, res: Response): void {
    //   const {
    //     title,
    //     slug,
    //     content,
    //     featuredImage,
    //     category,
    //     published,
    //   } = req.body;
    //   const post = new Post({
    //     title,
    //     slug,
    //     content,
    //     featuredImage,
    //     category,
    //     published,
    //   });
    //   post
    //     .save()
    //     .then((data) => {
    //       res.status(201).json({ data });
    //     })
    //     .catch((error) => {
    //       res.status(500).json({ error });
    //     });
    // }
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
    PostRouter.prototype.routes = function () {
        this.router.post('/', this.getPosts);
        this.router.get('/:currentUserId', this.getPost);
        // this.router.post('/', this.create);
        // this.router.put('/:slug', this.update);
        // this.router.delete('/:slug', this.delete);
    };
    return PostRouter;
}());
exports.PostRouter = PostRouter;
var postRoutes = new PostRouter();
postRoutes.routes();
exports.default = postRoutes.router;
//# sourceMappingURL=PostRouter.js.map
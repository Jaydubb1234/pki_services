import { Request, Response, Router } from 'express';
import { mysqlDb } from "../config/db"
//import Post from '../models/Post';

export class PostRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  //get all current user post and followers post
  public getPosts(req: Request, res: Response): void {
    const { currentUserId, lastId } = req.body;
      let sqlQuery
        console.log('lastId ', lastId)
        lastId ? 
          sqlQuery = `SELECT wp.post_content, wp.post_title, wp.ID as id, wp.comment_count, wp.post_date, wp.post_author, wp.post_modified,
            u.display_name 
          FROM wordpresstest.wp_posts as wp
          INNER JOIN wordpresstest.wp_users as u ON u.ID = wp.post_author
          WHERE post_status = 'publish'
          AND post_type = 'post'
          AND post_author 
          IN (SELECT leader_id 
          FROM wordpresstest.wp_bp_follow 
          WHERE follower_id = ${currentUserId})
          AND wp.ID < ${lastId}
          ORDER BY post_date DESC
          LIMIT 10` 
        :
          sqlQuery = `SELECT wp.post_content, wp.post_title, wp.ID as id, wp.comment_count, wp.post_date, wp.post_author, wp.post_modified,
            u.display_name 
          FROM wordpresstest.wp_posts as wp
          INNER JOIN wordpresstest.wp_users as u ON u.ID = wp.post_author
          WHERE post_status = 'publish'
          AND post_type = 'post'
          AND post_author 
          IN (SELECT leader_id 
          FROM wordpresstest.wp_bp_follow 
          WHERE follower_id = ${currentUserId})
          ORDER BY post_date DESC
          LIMIT 10`

      console.log('sqlQuery', sqlQuery)

      mysqlDb
        .then( (client) => {
            client.query(sqlQuery, 
            (err, results, fields) =>{
                if (err) return res.status(500).json({ err })
                return res.status(200).json(
                  {
                    code: res.statusCode,
                    message: "OK",
                    datetime: new Date(),
                    data:results
                  }
                );
                mysqlDb.close()
            })
        })
        .catch( (err) => {
            console.error(err)
            console.error(res.status(500).json({ err }))
            throw new Error(err)
        })
  }

  //get single post by author
  public getPost(req: Request, res: Response): void {
    const { postAuthorId } = req.params;
      const sqlQuery = `SELECT * FROM wordpresstest.wp_posts WHERE post_author = ${postAuthorId}`
      mysqlDb
        .then( (client) => {
            client.query(sqlQuery, 
            (err, results, fields) =>{
                if (err) return res.status(500).json({ err })
                console.log(res)
                return res.status(200).json(
                  {
                    code: res.statusCode,
                    message: "OK",
                    datetime: new Date(),
                    data:results
                  }
                );
                mysqlDb.close()
            })
        })
        .catch( (err) => {
            console.error(res.status(500).json({ err }))
            throw new Error(err)
        })
  }

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

  public routes() {
    this.router.post('/', this.getPosts);
    this.router.get('/:currentUserId', this.getPost);
    // this.router.post('/', this.create);
    // this.router.put('/:slug', this.update);
    // this.router.delete('/:slug', this.delete);
  }
}

const postRoutes = new PostRouter();
postRoutes.routes();

export default postRoutes.router;

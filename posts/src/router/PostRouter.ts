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

    queryToMysql(res,sqlQuery)
  }

  //get single post by author
  public getPost(req: Request, res: Response): void {
    const { postAuthorId } = req.params
    const sqlQuery = `SELECT * FROM wordpresstest.wp_posts WHERE post_author = ${postAuthorId}`
    queryToMysql(res,sqlQuery)
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

  // create a new post
  public createPost(req: Request, res: Response): void {
    const { body, creationDate } = req.body.postContent;
    const { currentUserId } = req.body

    const sqlQuery = `INSERT INTO wordpresstest.wp_posts
      (
        post_author,
        post_date,
        post_date_gmt,
        post_content,
        post_title,
        post_excerpt,
        post_status,
        comment_status,
        ping_status,
        post_password,
        post_name,
        to_ping,
        pinged,
        post_modified,
        post_modified_gmt,
        post_content_filtered,
        post_parent,
        guid,
        menu_order,
        post_type,
        post_mime_type,
        comment_count
      )
    VALUES
      (
        ${currentUserId},
        '${creationDate}',
        '${creationDate}',
        '${body}',
        'post_title',
        '',
        'publish',
        'open',
        'open',
        '',
        'post_name',
        '',
        '',
        '${creationDate}',
        '${creationDate}',
        '',
        '0',
        'guid',
        'menu_order',
        'post',
        '',
        '0'
      )`
    
    queryToMysql(res,sqlQuery)
  }

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

  public routes() {
    this.router.post('/', this.getPosts);
    this.router.get('/:currentUserId', this.getPost);
    this.router.post('/create', this.createPost);
    // this.router.put('/:slug', this.update);
    // this.router.delete('/:slug', this.delete);
  }
}

function queryToMysql(res: Response, sqlQuery: String): void {
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

const postRoutes = new PostRouter();
postRoutes.routes();

export default postRoutes.router;

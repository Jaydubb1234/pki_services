import { Request, Response, Router } from 'express';
import { mysqlDb } from "../config/db"
//import User from '../models/User';

export class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public getUsers(req: Request, res: Response): void {
    const {lastId} = req.body
        let sqlQuery
        lastId ? 
          sqlQuery = `SELECT *
          FROM wordpresstest.wp_users as u
          INNER JOIN wordpresstest.wp_signups as su ON u.user_email = su.user_email
          WHERE su.active = 1 AND u.ID < ${lastId}
          ORDER BY su.activated DESC
          LIMIT 10` 
        :
          sqlQuery = `SELECT *
          FROM wordpresstest.wp_users as u
          INNER JOIN wordpresstest.wp_signups as su ON u.user_email = su.user_email
          WHERE su.active = 1
          ORDER BY su.activated DESC
          LIMIT 10`

        mysqlDb
            .then( (client) => {
                client.query(sqlQuery, 
                (err, results, fields) =>{
                    if (err) return res.status(500).json({ err })
                    return res.status(200).json(
                      {
                        code: res.statusCode,
                        message: res.statusMessage,
                        datetime: new Date(),
                        data:results
                      }
                    );
                    mysqlDb.close()
                })
            })
            .catch( (err) => {
                console.error(err)
                throw new Error(err)
            })
  }

  public getUser(req: Request, res: Response): void {
    const { username } = req.params;

      mysqlDb
        .then( (client) => {
            client.query(`SELECT * FROM wp_users WHERE user_nicename = ?`,username, 
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
            console.error(res.status(500).json({ err }))
            throw new Error(err)
        })
  }

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

  public deleteUser(req: Request, res: Response): void {
    const { username } = req.params;

      mysqlDb
        .then( (client) => {
            client.query('DELETE FROM wp_users WHERE user_nicename = ?',username, 
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
            res.status(500).json({ err });
            console.error(err)
            throw new Error(err)
            return 
        })
  }

  // set up our routes
  public routes() {
    this.router.post('/', this.getUsers);
    this.router.get('/:username', this.getUser);
    // this.router.post('/', this.create);
    // this.router.put('/:username', this.update);
    this.router.delete('/:username', this.deleteUser);
  }
}

const userRoutes = new UserRouter();
userRoutes.routes();

export default userRoutes.router;

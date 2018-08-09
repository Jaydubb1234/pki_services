import * as mysql from "mysql-ssh";
import config from '../../config';
export const mysqlDb = mysql.connect(
	{
		host: config.mysqlHost, 
		user: config.mysqlUser,
		password: config.mysqlPassword
	},
	{
		host: config.mysqlLocalhost,
		user: config.mysqlUser,
		password: config.mysqlPassword, 
		database:config.mysqlDb
	}
)
require('dotenv').config();

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "sleact",
    "host": "localhost",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "sleact",
    "host": "localhost",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "sleact",
    "host": "localhost",
    "dialect": "mysql"
  }
}

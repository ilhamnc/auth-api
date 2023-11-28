const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'auth-user',
  password: 'authentic1009',
  database: 'user-db',
});

module.exports = connection;

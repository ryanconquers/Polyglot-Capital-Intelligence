const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Aryan@1007',   // <-- your actual password
  database: 'pcis'
});

module.exports = db;
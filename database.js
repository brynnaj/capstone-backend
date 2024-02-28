// creating database connection
const mysql = require('mysql2');
require('dotenv').config();


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


//create db connection
connection.connect(function (err) {
    if (err) throw err;
    console.log('MySQL Database is Connected!!!!');
   });
   
   //exports conncection to use in different file
   module.exports = connection;
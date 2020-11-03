
var mysql = require("mysql");
const util = require('util')


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "W0odenb!rds2025",
    database: "employees",
    port: 3306
});




connection.query = util.promisify(connection.query);

connection.connect(function (err) {
console.log("Server listening on port " + connection.threadId) })



module.exports = connection;
import util from 'util';
import mysql from 'mysql';

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employees"
});

connection.connect();


connection.query = util.promisify(connection.query);

module.exports = connection;
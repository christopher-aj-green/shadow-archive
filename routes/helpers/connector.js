var mysql = require('mysql');

module.exports = function () {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });


    connection.connect(function (error) {
        if (error){
            console.log("Couldn't connect to database. Error : ");
            console.log(error);
        }
    });
    return connection;
}
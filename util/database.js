// const mysql = require("mysql2");
// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     database: "fauzan_test_schema",
//     password: "akuinginmunculditv",
// });
// module.exports = pool.promise();

// MARK: Sequelize version
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    "database_scheme_test_1",
    "root",
    "akuinginmunculditv",
    {
        dialect: "mysql",
    }
);

module.exports = sequelize;

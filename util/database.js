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

const sequelize = new Sequelize("rikrik_schema", "root", "rikrikjs", {
  dialect: "mysql",
});

// var i = 2020;
// while (i < 2025) {
//     sequelize.query(
//         "CREATE TABLE IF NOT EXISTS `" +
//             i +
//             "` (`idBukuRef` VARCHAR(255), `namaBukuRef` VARCHAR(255) NOT NULL, `idMaterial` INTEGER NOT NULL auto_increment , `namaMaterial` VARCHAR(255) NOT NULL, `satuan` VARCHAR(255), `koefisien` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`idMaterial`)) ENGINE=InnoDB"
//     );
//     i++;
// }

module.exports = sequelize;

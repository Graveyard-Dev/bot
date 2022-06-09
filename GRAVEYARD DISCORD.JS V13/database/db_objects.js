// Set the base directory to remove relative paths
const __basedir = __dirname;

const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.db",
});

const userFinance = require(`${__basedir}/models/currency/userFinance.js`)(sequelize, Sequelize.DataTypes);
//! WHEN YOU NEED A METHOD FOR DOING SOMETHING WITH THE DATABASE DO IT HERE INSTEAD OF IN THE CODE MANUALLY.
//makes it more readable and stuf

module.exports = { userFinance };
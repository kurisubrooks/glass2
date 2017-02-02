const Sequelize = require("sequelize");
const db = require("../Database");

const User = db.define("users", {
    guid: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.sync();

module.exports = User;

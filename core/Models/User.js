const Sequelize = require("sequelize");
const db = require("../Database");

const User = db.define("users", {
    token: Sequelize.STRING,
    disabled: Sequelize.BOOLEAN,
    real_name: Sequelize.STRING,
    username: Sequelize.STRING,
    hash: Sequelize.STRING,
    salt: Sequelize.STRING,
    hint: Sequelize.STRING,
    email: Sequelize.STRING,
    permissions: Sequelize.STRING,
    data: Sequelize.STRING
});

User.sync({ alter: true });

module.exports = User;

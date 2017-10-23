const Sequelize = require("sequelize");
const path = require("path");

const database = new Sequelize({
    logging: false,
    dialect: "sqlite",
    storage: path.join(__dirname, "..", "db.sqlite")
});

class Database {
    static get db() {
        return database;
    }

    static get Models() {
        return { User: require("./models/User") };
    }

    static async newUser(data) {

    }

    static async deleteUser(username, password) {

    }

    static async checkLogin(username, password) {

    }

    static async validateToken(token) {

    }
}

module.exports = Database;

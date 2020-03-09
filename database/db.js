const Sequelize = require("sequelize")
const db = {}
const sequelize = new Sequelize("users", "root", "password", {
    host: 'localhost',
    dialect: 'mysql',
    operatorAliases: false,

    pool: {
        max: 15,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = db
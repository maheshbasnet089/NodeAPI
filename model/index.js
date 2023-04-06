const dbConfig = require("./../config/dbConfig.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Users Model
db.Users = require("./userModel")(sequelize, Sequelize);
db.Drivers = require("./driverModel")(sequelize, Sequelize);
db.Bus = require("./busModel")(sequelize, Sequelize);
db.CheckBoxValue = require("./busFeatureModel")(sequelize, Sequelize);
db.BookBus = require("./bookBusModel")(sequelize, Sequelize);
db.Seats = require("./seatModel")(sequelize, Sequelize);
db.Location = require("./mapModel")(sequelize, Sequelize);
db.Rating = require("./ratingModel")(sequelize, Sequelize);
db.Route = require("./routeModel")(sequelize, Sequelize);
/* RDBMS Connection */
// db.Users.hasOne(db.Profile);
// db.Profile.belongsTo(db.Users);

// db.Category.hasMany(db.Job);
// db.Job.belongsTo(db.Category);
// db.Job.belongsTo(db.City);

// db.City.hasMany(db.Job);
// db.Users.hasMany(db.Job);
// db.Job.belongsTo(db.Users);

// db.Blog.hasMany(db.Category);
// db.Category.belongsTo(db.Blog);
db.Users.hasOne(db.Drivers);
db.Drivers.belongsTo(db.Users);

db.Drivers.hasMany(db.Bus);
db.Bus.belongsTo(db.Drivers);

db.Bus.hasMany(db.BookBus);
db.BookBus.belongsTo(db.Bus);

db.Users.hasMany(db.BookBus);
db.BookBus.belongsTo(db.Users);

db.BookBus.hasMany(db.Seats);
db.Seats.belongsTo(db.BookBus);

db.Bus.hasMany(db.Rating);
db.Rating.belongsTo(db.Bus);

db.Users.hasMany(db.Rating);
db.Rating.belongsTo(db.Users);

db.Route.hasMany(db.Bus);
db.Bus.belongsTo(db.Route);

// db.Drivers.hasMany(db.Location);
// db.Location.belongsTo(db.Drivers);

module.exports = db;

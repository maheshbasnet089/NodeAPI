const { sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const Rating = sequelize.define("rating", {
    rating: {
      type: Sequelize.INTEGER,
    },
    comment: {
      type: Sequelize.STRING,
    },
  });
  return Rating;
};

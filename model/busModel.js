module.exports = (sequelize, Sequelize) => {
  const Bus = sequelize.define("bus", {
    busName: {
      type: Sequelize.STRING,
    },
    busNumber: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    seats: {
      type: Sequelize.STRING,
    },

    busFare: {
      type: Sequelize.STRING,
    },
    busType: {
      type: Sequelize.STRING,
    },
    drivingLicense: {
      type: Sequelize.STRING,
    },
    busPhoto: {
      type: Sequelize.STRING,
    },
    rating: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    time: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.STRING,
    },
  });

  return Bus;
};

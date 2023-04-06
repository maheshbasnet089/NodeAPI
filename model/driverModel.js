module.exports = (sequelize, Sequelize) => {
  const Driver = sequelize.define("driver", {
    name: {
      type: Sequelize.STRING,
    },
 
    phone: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
    },
    vehicleNumber: {
      type: Sequelize.STRING,
    },
    busPhoto: {
      type: Sequelize.STRING,
    },
    busType: {
      type: Sequelize.STRING,
    },
    licenseFront: {
      type: Sequelize.STRING,
    },
    licenseBack: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM("active", "inactive"),
      defaultValue: "inactive",
    },
  });

  return Driver;
};

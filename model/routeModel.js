module.exports = (sequelize, Sequelize) => {
  const Route = sequelize.define("route", {
    from: {
      type: Sequelize.STRING,
    },
    to: {
      type: Sequelize.STRING,
    },
    fromLat: {
      type: Sequelize.STRING,
    },
    toLat: {
      type: Sequelize.STRING,
    },
    toLng: {
      type: Sequelize.STRING,
    },
    fromLng: {
      type: Sequelize.STRING,
    },
    fromOriginal: {
      type: Sequelize.STRING,
    },
    toOrginal: {
      type: Sequelize.STRING,
    },
    fromLatOriginal: {
      type: Sequelize.STRING,
    },
    fromLngOriginal: {
      type: Sequelize.STRING,
    },
  });

  return Route;
};

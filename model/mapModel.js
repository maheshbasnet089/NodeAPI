module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define("Location", {
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return Location;
};

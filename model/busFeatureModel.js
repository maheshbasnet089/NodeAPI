module.exports = (sequelize, Sequelize) => {
  const CheckBoxValue = sequelize.define("checkBoxValue", {
    busName: {
      type: Sequelize.STRING,
    },
    wifi: {
      type: Sequelize.STRING,
    },
    tv: {
      type: Sequelize.STRING,
    },
    ac: {
      type: Sequelize.STRING,
    },
    music: {
      type: Sequelize.STRING,
    },
  });

  return CheckBoxValue;
};

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.ENUM("admin", "user", "driver"),
      defaultValue: "user",
    },
    password: {
      type: Sequelize.STRING,
    },
    otp: {
      type: Sequelize.INTEGER,
    },
  });

  return User;
};

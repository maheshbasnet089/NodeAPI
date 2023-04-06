module.exports = (sequelize, Sequelize) => {
  const Seat = sequelize.define("seat", {
    seatNumber: {
      type: Sequelize.STRING,
    },
  });

  return Seat;
};

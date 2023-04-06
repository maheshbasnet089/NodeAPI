module.exports = (sequelize, Sequelize) => {
  const BookBus = sequelize.define("bookBus", {
    seatNumber: {
      type: Sequelize.STRING,
    },
    busFare: {
      type: Sequelize.STRING,
    },
    totalAmount: {
      type: Sequelize.STRING,
    },
    boardingPlace: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    paymentType: {
      type: Sequelize.ENUM("COD", "khalti"),
      defaultValue: "COD",
    },
    status: {
      type: Sequelize.ENUM("pending", "paid", "unpaid"),
      defaultValue: "pending",
    },
    qr: {
      type: Sequelize.STRING,
    },
    bookedDate: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW,
    },
  });

  return BookBus;
};

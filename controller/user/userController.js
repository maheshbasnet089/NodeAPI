const bookBusModel = require("../../model/bookBusModel.js");
const {
  BookBus,
  Seats,
  Users,
  sequelize,
  Bus,
} = require("../../model/index.js");
const qrCode = require("qrcode");

class UserController {
  async bookBus(req, res) {
    try {
      const bookedBus = await BookBus.create({
        userId: req.userId,
        busId: req.body.id,
        seatNumber: req.body.seat,
        busFare: req.body.busFare,
        totalAmount: req.body.totalAmount,
        boardingPlace: req.body.boardingPlace,
        phone: req.body.phone,
        paymentType: req.body.paymentType,
        qr: req.body.qr + req.userId,
        bookedDate: req.body.date,
      });
      console.log(bookedBus);
      if (bookedBus)
        for (var i = 0; i < req.body.seats.length; i++) {
          await Seats.create({
            seatNumber: req.body.seats[i],
            bookBusId: bookedBus.id,
          });
          await sequelize.query(
            `UPDATE busSeats_${parseInt(req.body.id)} SET userId=${
              req.userId
            } WHERE seat='${req.body.seats[i]}'`,
            { type: sequelize.QueryTypes.UPDATE }
          );
        }
      res.json({
        status: 200,
        message: "Bus was booked successfully!",
      });
    } catch (e) {
      res.json({
        status: 400,
        message: e.message,
      });
    }
  }
  async getPassengers(req, res) {
    try {
      const passengers = await BookBus.findAll({
        where: {
          busId: req.params.id,
        },
        include: [
          {
            model: Seats,
          },
          {
            model: Users,
          },
        ],
      });
      res.json({
        status: 200,
        message: "Passengers fetched successfully",
        data: passengers,
      });
    } catch (e) {
      res.json({
        status: 400,
        message: e.message,
      });
    }
  }
  async generateQrCode(req, res) {
    const { busId, qrPath } = req.body;
    console.log(busId, qrPath);
    try {
      const qr = await qrCode.toDataURL(busId);

      res.json({
        status: 200,
        message: "QR code generated successfully",
        qr,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
  async updateQrCode(req, res) {
    const { busId, qrPath } = req.body;
    console.log(busId, qrPath, req.userId);
    try {
      const updatedBus = await BookBus.update(
        {
          qr: qrPath,
        },
        {
          where: {
            busId,
            userId: req.userId,
          },
        }
      );
      console.log(updatedBus);
      res.json({
        status: 200,
        message: "QR code updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
  async myQr(req, res) {
    try {
      const qr = await BookBus.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Bus,
          },
        ],
      });
      res.json({
        status: 200,
        message: "QR code fetched successfully",
        qr,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
  async deleteUser(req, res) {
    const deleteUser = await Users.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({
      status: 200,
      message: "User deleted successfully",
    });
  }
  async getMe(req, res) {
    try {
      const user = await Users.findOne({
        where: {
          id: req.userId,
        },
      });
      res.json({
        status: 200,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      res.json({
        status: 400,
        message: error.message,
      });
    }
  }

  async getMyBookings(req, res) {
    try {
      const bookings = await BookBus.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Bus,
          },
        ],
      });
      res.json({
        status: 200,
        message: "Bookings fetched successfully",
        data: bookings,
      });
    } catch (error) {
      res.json({
        status: 400,
        message: error.message,
      });
    }
  }

  async getAllTickets(req, res) {
    try {
      const bookings = await BookBus.findAll({
        include: [
          {
            model: Bus,
          },
          {
            model: Users,
          },
        ],
      });
      res.json({
        status: 200,
        message: "Bookings fetched successfully",
        data: bookings,
      });
    } catch (error) {
      res.json({
        status: 400,
        message: error.message,
      });
    }
  }
  async cancelBooking(req, res) {
    const { id } = req.params;

    // cancelBooking delete from busBook table and update in busseats table
    try {
      for (var i = 0; i < req.body.seatNumber.length; i++) {
        // await sequelize.query(
        //   `UPDATE busseats_${parseInt(
        //     req.body.busId
        //   )} SET status='available',userId=null WHERE seat='${
        //     req.body.seatNumber[i]
        //   }'`,
        //   { type: sequelize.QueryTypes.UPDATE }
        // );
      }

      const deletedBooking = await BookBus.destroy({
        where: {
          id,
        },
      });
      res.json({
        status: 200,
        message: "Booking cancelled successfully",
      });
    } catch (error) {
      res.json({
        status: 400,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();

const {
  Drivers,
  Route,
  Bus,
  Users,
  CheckBoxValue,
  BookBus,
  Rating,
} = require("../../model");
const userModel = require("../../model/userModel");
const db = require("../../model/index");
const sequelize = db.sequelize;

const { QueryTypes, DataTypes, Op } = require("sequelize");
const { default: axios } = require("axios");

const busData = [
  { seatNumber: "A1", side: "A" },
  { seatNumber: "A2", side: "A" },
  { seatNumber: "B1", side: "B" },
  { seatNumber: "B2", side: "B" },
  { seatNumber: "A3", side: "A" },
  { seatNumber: "A4", side: "A" },
  { seatNumber: "B3", side: "B" },
  { seatNumber: "B4", side: "B" },
  { seatNumber: "A5", side: "A" },
  { seatNumber: "A6", side: "A" },

  { seatNumber: "B5", side: "B" },
  { seatNumber: "B6", side: "B" },

  { seatNumber: "A7", side: "A" },
  { seatNumber: "A8", side: "A" },
  { seatNumber: "B7", side: "B" },
  { seatNumber: "B8", side: "B" },
  { seatNumber: "A9", side: "A" },
  { seatNumber: "A10", side: "A" },
  { seatNumber: "B9", side: "B" },
  { seatNumber: "B10", side: "B" },
  { seatNumber: "A11", side: "A" },
  { seatNumber: "A12", side: "A" },
  { seatNumber: "B11", side: "B" },
  { seatNumber: "B12", side: "B" },
  { seatNumber: "A13", side: "A" },
  { seatNumber: "A14", side: "A" },

  { seatNumber: "B13", side: "B" },
  { seatNumber: "B14", side: "B" },
  { seatNumber: "A15", side: "A" },

  { seatNumber: "A16", side: "A" },
  { seatNumber: "B15", side: "B" },
  { seatNumber: "B16", side: "B" },
  { seatNumber: "A17", side: "A" },
  { seatNumber: "A18", side: "A" },

  { seatNumber: "B17", side: "B" },
  { seatNumber: "B18", side: "B" },
];

exports.registerDriver = async (req, res) => {
  const { busType, name, phone, vehicleNumber } = req.body;
  console.log("Files ", req.files.busPhoto[0]);
  const licenseFrontPath = req.files.licenseFront[0].filename;
  const licenseBackPath = req.files.licenseBack[0].filename;
  const busPhotoPath = req.files.busPhoto[0].filename;
  const userId = req.userId;
  try {
    const driver = {
      name,

      phone,
      role: "null",
      vehicleNumber,
      busType,
      licenseFront: `${process.env.baseUrl}` + licenseFrontPath,
      licenseBack: `${process.env.baseUrl}` + licenseBackPath,
      busPhoto: `${process.env.baseUrl}` + busPhotoPath,
      userId,
    };
    const createdDriver = await Drivers.create(driver);

    res.json({
      status: 200,
      message: "Driver was registered successfully!",
      createdDriver,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: "Driver was not registered successfully!",
      error,
    });
  }
};

exports.addBus = async (req, res) => {
  const { busName, busNumber, phone, email, seats, routes, busFare, busType } =
    req.body;
  const busPhotoPath = req.files.busPhoto[0].filename || "";
  const licensePhotoPath = req.files.licensePhoto[0].filename || "";
  const userId = req.userId;
  const driver = await Drivers.findOne({
    where: {
      userId,
    },
  });
  const driverId = driver.id;

  const bus = await Bus.create({
    busName,
    busNumber,
    phone,
    email,
    seats,
    busFare,
    busType,
    busPhoto: `${process.env.baseUrl}` + busPhotoPath,
    drivingLicense: `${process.env.baseUrl}` + licensePhotoPath,
    driverId,
    routeId: routes,
    time: req.body.time,
    date: req.body.date,
  });
  console.log(bus);

  await sequelize.query(
    `CREATE TABLE busSeats_${bus.id} 
    (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,seat VARCHAR(255),side VARCHAR(255),busId INT REFERENCES buses(id) ON DELETE CASCADE ON UPDATE CASCADE,userId INT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE )`,
    {
      type: QueryTypes.CREATE,
    }
  );
  for (var i = 0; i < req.body.seats; i++) {
    await sequelize.query(
      `INSERT INTO busSeats_${bus.id} (seat,side,busId) VALUES ('${busData[i].seatNumber}','${busData[i].side}','${bus.id}')`,
      {
        type: QueryTypes.INSERT,
      }
    );
  }
  await res.json({
    status: 200,
    message: "Bus was registered successfully!",
    bus,
  });
};
exports.getBuses = async (req, res) => {
  const driver = await Drivers.findOne({
    where: {
      userId: req.userId,
    },
  });

  const buses = await Bus.findAll({
    where: {
      driverId: driver.id,
    },
  });
  res.json({
    status: 200,
    message: "Buses were fetched successfully!",
    buses,
  });
};

exports.updateDriverStatus = async (req, res) => {
  const { status } = req.body;
  const driver = await Drivers.findOne({
    where: {
      id: req.params.id,
    },
  });
  const user = await Users.findOne({
    where: {
      id: driver.userId,
    },
  });
  console.log(user);
  console.log(driver);
  driver.status = status;
  driver.role = "driver";
  user.role = "driver";

  await driver.save();
  await user.save();
  res.json({
    status: 200,
    message: "Driver status was updated successfully!",
    driver,
  });
};

exports.getDrivers = async (req, res) => {
  const drivers = await Drivers.findAll({
    include: [
      {
        model: Users,
      },
    ],
  });
  res.json({
    status: 200,
    message: "Drivers were fetched successfully!",
    drivers,
  });
};

exports.getBus = async (req, res) => {
  const buses = await Bus.findAll({
    include: [
      {
        model: Route,
      },
      {
        model: Drivers,
      },
    ],
  });
  res.json({
    status: 200,
    message: "Buses were fetched successfully!",
    buses,
  });
};

exports.createBoxValue = async (req, res) => {
  const { busName } = req.body;
  const wifi = req.body.wifi || "";
  const tv = req.body.tv || "";
  const ac = req.body.ac || "";
  const toilet = req.body.toilet || "";
  const music = req.body.music || "";

  console.log(req.body);
  const features = await CheckBoxValue.create({
    wifi,
    tv,
    ac,
    toilet,
    music,
    busName,
  });

  res.json({ features, status: 200, message: "Data received successfully!" });
};

exports.getBusById = async (req, res) => {
  const bus = await Bus.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Drivers,
      },
      {
        model: Route,
      },
    ],
  });
  const features = await CheckBoxValue.findOne({
    where: {
      busName: req.params.id,
    },
  });
  res.json({
    status: 200,
    features,
    message: "Bus was fetched successfully!",
    bus,
  });
};

exports.getBusSeats = async (req, res) => {
  const seats = await sequelize.query(
    `SELECT * FROM busSeats_${req.params.id}  `,
    {
      type: QueryTypes.SELECT,
    }
  );

  // send the bookedseats from bookbus model according to the createdAt date
  // const bookedSeats = await BookBus.findAll({
  //   where: {
  //     createdAt: req.body.date,
  //     busId: req.params.id,
  //   },
  // });
  // // creaatedAt is storing date and time get the date only
  // // const date = bookedSeats.createdAt.split("T")[0];
  // // console.log(date);

  // console.log(bookedSeats);

  res.json({
    status: 200,
    message: "Seats were fetched successfully!",
    seats,
  });
};

exports.getBusSeatsSingle = async (req, res) => {
  console.log(req.body.date);
  if (
    req.body.date == null ||
    req.body.date == undefined ||
    req.body.date == ""
  ) {
    const busSeats = await sequelize.query(
      `SELECT * ,'available' AS status FROM busSeats_${req.params.id} `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.json({
      status: 200,
      message: "Seats were fetched successfully!",
      seats: busSeats,
    });
  }

  const busSeats = await sequelize.query(
    `SELECT * FROM busSeats_${req.params.id} `,
    {
      type: QueryTypes.SELECT,
    }
  );

  const bookedSeats = await BookBus.findAll({
    where: {
      bookedDate: req.body.date,
      busId: req.params.id,
    },
  });
  const bookedSeatIds = bookedSeats.map((seat) => seat.id);

  const bookedSeatsByNumber = await db.Seats.findAll({
    where: {
      bookBusId: { [Op.in]: bookedSeatIds },
    },
    attributes: ["seatNumber"],
  });

  const bookedSeatNumbers = bookedSeatsByNumber.map((seat) => seat.seatNumber);

  const busSeatsWithStatus = busSeats.map((seat) => ({
    ...seat,
    status: bookedSeatNumbers.includes(seat.seat) ? "booked" : "available",
  }));
  // const busSeatsWithStatus = busSeats.map((seat) => {
  //   const status = bookedSeatNumbers.includes(seat.seat)
  //     ? "booked"
  //     : "available";
  //   return { , status };
  // });

  // set it in array and send it to the frontend

  // const busSeatsWithStatus = busSeats.map((seat) => {
  //   const values = seat.get();
  //   values.status = bookedSeatIds.includes(values.bookbusid)
  //     ? "booked"
  //     : "available";
  //   delete values.createdAt;
  //   delete values.updatedAt;
  //   return values;
  // });

  res.json({
    status: 200,
    message: "Seats were fetched successfully!",
    seats: busSeatsWithStatus,

    // busSeatsWithStatus,
  });
};

exports.getPassengersDetails = async (req, res) => {
  console.log(req.body);
  const passenger = await BookBus.findAll({
    where: {
      busId: req.body.busId,
      userId: req.body.userId,
    },
    include: [
      {
        model: Users,
      },
      {
        model: Bus,
        include: [
          {
            // foreignKey: "driverId",

            model: Drivers,
          },
        ],
      },
    ],
  });
  const seats = await sequelize.query(
    `SELECT * FROM busSeats_${req.body.busId} WHERE userId=${req.body.userId}  `,
    {
      type: QueryTypes.SELECT,
    }
  );

  res.json({
    status: 200,
    message: "Passengers details were fetched successfully!",
    passenger,
    seats,
  });
};

exports.getAllData = async (req, res) => {
  const buses = await Bus.findAll({
    include: [
      {
        model: Drivers,
      },
      {
        model: Route,
      },
    ],
  });

  const drivers = await Drivers.findAll();
  const routes = await Route.findAll();
  const users = await Users.findAll();
  const ratings = await Rating.findAll({
    include: [
      {
        model: Users,
      },
      {
        model: Bus,
      },
    ],
  });

  res.json({
    status: 200,
    message: "Buses were fetched successfully!",
    buses,
    drivers,
    routes,
    ratings,
    users,
  });
};

exports.deleteBus = async (req, res) => {
  const deleteBus = await Bus.destroy({
    where: {
      id: req.params.id,
    },
  });
  await sequelize.query(`DROP TABLE busSeats_${req.params.id}`, {
    type: QueryTypes.DROP,
  });
  res.json({
    status: 200,
    message: "Bus was deleted successfully!",
    deleteBus,
  });
};

exports.paymentVerify = async (req, res) => {
  const { token, amount } = req.body;
  console.log(req.userId);
  const secretKey = "test_secret_key_a13b4e7346634bfa998adb934bb8d19b";

  try {
    const response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      {
        token,
        amount,
      },
      {
        headers: {
          Authorization: `Key ${secretKey}`,
        },
      }
    );

    const bookBusedUpdate = await BookBus.update(
      {
        status: "paid",
      },
      {
        where: {
          userId: req.userId,
        },
      }
    );

    res.json({
      status: 200,
      message: "Payment was verified successfully!",
      response: response.data,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: "Payment was not verified!",
      error,
    });
  }
};

exports.getPaymentDetails = async (req, res) => {
  const payment = await BookBus.findAll({
    where: {
      status: "paid",
    },
    include: [
      {
        model: Bus,
        include: [
          {
            model: Drivers,
          },
        ],
      },
      {
        model: Users,
      },
    ],
  });

  res.json({
    status: 200,
    message: "Payment details were fetched successfully!",
    payment,
  });
};

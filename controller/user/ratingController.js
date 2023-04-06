const { Rating, Users, Bus } = require("../../model");
//comment the whole file and paste this code

// to create rating this is made
exports.createRating = async (req, res) => {
  try {
    // getting data from the body of frontend and store it in database
    const bus = await Bus.findByPk(req.body.busId);
    const rating = bus.rating;
    const newRating = (parseInt(rating) + parseInt(req.body.rating)) / 2;
    const updatedBus = await Bus.update(
      { rating: newRating },
      { where: { id: req.body.busId } }
    );

    const ratings = await Rating.create({
      rating: req.body.rating,
      comment: req.body.comment,
      userId: req.userId,
      busId: req.body.busId,
    });
    res.json({
      status: 200,
      message: "Rating done",
      ratings,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: error.message,
    });
  }
};

// exports.getAllRatings = async (req, res) => {
//   //getting data from the database and sending it to the frontend
//   const ratings = await Rating.findAll({
//     include: {
//       model: Bus,
//       attributes: ["id", "busName"], // specify the fields to retrieve from the Bus table
//     },
//     attributes: ["id", "busId", "rating"], // specify the fields to retrieve from the Rating table
//   });

//   const busRatings = {};
//   ratings.forEach((rating) => {
//     console.log(rating);
//     const busId = rating.busId; // access the busId from the included Bus model
//     if (busRatings[busId]) {
//       busRatings[busId].total += rating.rating;
//       busRatings[busId].count++;
//     } else {
//       busRatings[busId] = { total: rating.rating, count: 1 };
//     }
//   });
//   console.log("sdf", busRatings);
//   console.log("nwer", busRatings);
//   const busList = Object.keys(busRatings);
//   const data = busList.map((busId) => {
//     const { busName } = ratings.find(
//       (rating) => rating.busId === Number(busId)
//     ).Bus;
//     return {
//       busId: busId,
//       busName: busName,
//       averageRating: (
//         busRatings[busId].total / busRatings[busId].count
//       ).toFixed(2),
//     };
//   });

//   res.json({
//     status: 200,
//     message: "Ratings fetched",
//     data,
//   });
// };

//for getting ratings

exports.getRatings = async (req, res) => {
  //getting data from the database and sending it to the frontend
  try {
    const ratings = await Rating.findAll({
      where: {
        busId: req.params.id,
      },
      include: [
        {
          model: Users,
        },
      ],
    });
    res.json({
      status: 200,
      message: "Ratings fetched",
      ratings,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: error.message,
    });
  }
};

exports.myRatings = async (req, res) => {
  //getting data from the database and sending it to the frontend
  try {
    const ratings = await Rating.findAll({
      where: {
        userId: req.userId, //userId is coming from the middleware
      },
    });
    res.json({
      status: 200,
      message: "Ratings fetched",
      ratings,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: error.message,
    });
  }
};

exports.allRatings = async (req, res) => {
  //getting data from the database and sending it to the frontend
  try {
    const ratings = await Rating.findAll({
      include: [
        {
          model: Users,
        },
      ],
    });
    res.json({
      status: 200,
      message: "Ratings fetched",
      ratings,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: error.message,
    });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const ratings = await Rating.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({
      status: 200,
      message: "Rating deleted",
      ratings,
    });
  } catch (error) {
    res.json({
      status: 400,
      message: error.message,
    });
  }
};

const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");
const driverRoute = require("./routes/driverRoute");
const userRoute = require("./routes/userRoute");
const ratingRoute = require("./routes/ratingRoute");
const routeRoute = require("./routes/routeRoute");
const db = require("./model/index");
const cors = require("cors");
const { Location } = require("./model/index");
require("dotenv").config();
db.sequelize.sync({ force: 0 });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.static("uploads"));

app.use("/api/auth", authRoute);
app.use("/api", routeRoute);
app.use("/api/driver", driverRoute);
app.use("/api/user", userRoute);
app.use("/api/", ratingRoute);
app.get("/locations", async (req, res) => {
  const locations = await Location.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json({
    status: 200,
    locations,
  });
});
const server = app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

const socket = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
socket.on("connection", (socket) => {
  console.log("connected");
  socket.on("location", async (data) => {
    console.log(`location received: ${data.latitude}, ${data.longitude}`);
    const locationData = await Location.create({
      latitude: data.latitude,
      longitude: data.longitude,
    });
    const latestData = await Location.findAll({
      order: [["createdAt", "DESC"]],
    });

    console.log(latestData[0].dataValues);

    socket.broadcast.emit("locationLatest", latestData[0].dataValues);
  });
});

const { Users } = require("../model");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.isAuthenticated = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  console.log(req.headers);
  console.log(token);
  if (!token) {
    return res.json({
      status: 401,
      message: "You must be logged in",
    });
  }

  //using promisify , we don't need to handle the callback of the jwt
  const decoded = await promisify(jwt.verify)(token, "hahaha");
  console.log(decoded);
  const loggedInUser = await Users.findOne({ where: { id: decoded.id } });
  console.log(loggedInUser);
  if (!loggedInUser) {
    return res.status(400).json({
      message: "You are not the user belonging to this token",
    });
  }
  req.userId = loggedInUser.id;
  next();
};

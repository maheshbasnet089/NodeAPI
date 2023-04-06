const bcrypt = require("bcryptjs");

const db = require("../../model/index");
const User = db.Users;
const jwt = require("jsonwebtoken");
const sendEmail = require("../../services/sendEmail");

exports.registerUser = async (req, res) => {
  // Save User to Database
  console.log("Processing func -> RegisterUser");
  const user = {
    name: req.body.name,
    email: req.body.email,

    password: bcrypt.hashSync(req.body.password, 8),
  };
  const created = await User.create(user);

  res.json({
    status: 200,
    message: "User was registered successfully!",
    created,
  });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    User.findOne({ where: { email: email } }).then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password",
        });
      }
      var token = jwt.sign({ id: user.id }, "hahaha", {
        expiresIn: 86400,
      });
      res.cookie("token", token);
      res.status(200).send({
        status: 200,
        id: user.id,
        user,
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const findUser = await User.findOne({ where: { email: email } });
  if (!findUser) {
    return res.json({ status: 404, message: "User not found" });
  }

  findUser.otp = otp;
  await findUser.save();

  // save otp in database

  try {
    await sendEmail({ email, subject: "Reset Password", otp: otp });
    res.status(200).send({
      status: 200,
      message: "Otp sent to your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { otp, password,email } = req.body;
  const findUser = await User.findOne({ where: { email: email } });
  if (!findUser) {
    return res.json({ status : 404, message: "User not found" });
  }

  if (findUser.otp != otp) {
    return res.json({ status : 404, message: "Invalid Otp" });
  }

  findUser.password = bcrypt.hashSync(password, 8);
  await findUser.save();

  res.json({
    status: 200,
    message: "Password reset successfully",
  });
};

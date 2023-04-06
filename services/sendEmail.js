const nodemailer = require("nodemailer");

const sendEmail = async (options, job) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "sastobussewa@gmail.com",
      pass: "dsgeckwjmdaphpda",
    },
  });

  const mailOptions = {
    from: "Sasto Buss <sastobussewa@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: "Your otp is  " + options.otp,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

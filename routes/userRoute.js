const {
  getPassengers,
  generateQrCode,
  getMyQr,
  myQr,
  updateQrCode,
  deleteUser,
  getMe,
  getMyBookings,
  cancelBooking,
} = require("../controller/user/userController");
const userController = require("../controller/user/userController");
const { isAuthenticated } = require("../services/isAuthenticated");

const router = require("express").Router();

router.route("/bookBus").post(isAuthenticated, userController.bookBus);
router.route("/getPassengers/:id").get(isAuthenticated, getPassengers);
router.route("/generateQrCode").post(isAuthenticated, generateQrCode);

router.route("/myQr").get(isAuthenticated, myQr);
router.route("/updateQrCode").post(isAuthenticated, updateQrCode);

router.route("/:id").delete(deleteUser);
router.route("/getMe").get(isAuthenticated, getMe);
router.route("/mytickets").get(isAuthenticated, getMyBookings);
router.route("/alltickets").get(isAuthenticated, userController.getAllTickets);
router.route("/cancelTicket/:id").post(cancelBooking);

module.exports = router;

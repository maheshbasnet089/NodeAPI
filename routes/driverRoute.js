const {
  registerDriver,
  addBus,
  updateDriverStatus,
  getDrivers,
  getBuses,
  getBus,
  createBoxValue,
  getBusById,
  getBusSeats,
  getBusSeatsSingle,
  getPassengersDetails,
  getAllData,
  deleteBus,
  paymentVerify,
  getPaymentDetails,
} = require("../controller/driver/driverController");
const { isAuthenticated } = require("../services/isAuthenticated");

const router = require("express").Router();
const { multer, storage } = require("./../services/multerConfig");
const upload = multer({ storage: storage });

router.route("/register").post(
  isAuthenticated,
  upload.fields([
    { name: "busPhoto", maxCount: 1 },
    { name: "licenseBack", maxCount: 1 },
    { name: "licenseFront", maxCount: 1 },
  ]),
  registerDriver
);
router.route("/bus").post(
  isAuthenticated,
  upload.fields([
    { name: "busPhoto", maxCount: 1 },
    { name: "licensePhoto", maxCount: 1 },
  ]),
  addBus
);

router
  .route("/updateDriverStatus/:id")
  .post(isAuthenticated, updateDriverStatus);

router.route("/").get(getDrivers);
router.route("/buses").get(isAuthenticated, getBuses);
router.route("/bus").get(getBus);
router.route("/bus/addFeature").post(createBoxValue);
router.route("/bus/:id").get(getBusById).delete(deleteBus);

router.route("/busSeats/:id").get(getBusSeats);
router.route("/busSeat/:id").post(getBusSeatsSingle);
router.route("/passenger").post(isAuthenticated, getPassengersDetails);

router.route("/verifyPayment").post(isAuthenticated, paymentVerify);
router.route("/paymentDetails").get(getPaymentDetails);

router.route("/getAll").get(getAllData);
module.exports = router;

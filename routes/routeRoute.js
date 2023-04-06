const {
  createRoute,
  getRoutes,
  updateRoute,
  deleteRoute,
  getAllRoutes,
} = require("../controller/routeController");

const router = require("express").Router();

router.route("/route").post(createRoute).get(getRoutes);
router.route("/route/:id").patch(updateRoute).delete(deleteRoute);
router.route("/getAllRoutes").get(getAllRoutes);

module.exports = router;

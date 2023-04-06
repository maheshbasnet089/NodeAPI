const {
  getRatings,
  createRating,
  myRatings,
  allRatings,
  deleteRating,
  getAllRatings,
} = require("../controller/user/ratingController");
const { isAuthenticated } = require("../services/isAuthenticated");

const router = require("express").Router();

router
  .route("/ratings")
  .post(isAuthenticated, createRating)
  .get(isAuthenticated, myRatings);

// router.route("/getAllRatings").get(getAllRatings);

router.route("/ratings/:id").get(getRatings).delete(deleteRating);
router.route("/allratings").get(allRatings);

module.exports = router;

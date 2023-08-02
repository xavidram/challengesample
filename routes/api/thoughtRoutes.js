const router = require("express").Router();
const {
  getAllThoughts,
  getSingleThought,
  createThought,
  updateThought,
  createReaction,
  deleteReaction,
} = require("../../controllers/thoughtController.js");

router.route("/").get(getAllThoughts).post(createThought);

router
  .route("/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .post(createReaction)
  .delete(deleteReaction);

module.exports = router;

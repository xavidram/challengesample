const router = require("express").Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../../controllers/userController");

// /api/users
router.route("/").get(getUsers).post(createUser);

// /api/users/:usersId
router.route("/:userId").get(getSingleUser).delete(deleteUser).post(updateUser);

module.exports = router;

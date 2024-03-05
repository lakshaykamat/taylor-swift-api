const express = require("express");
const {
  getAllSongs,
  newSong,
  searchSongs,
  getRandomSong,
} = require("../controllers/songController");
const router = express.Router();

router.route("/").get(getAllSongs);
router.route("/random").get(getRandomSong);
router.route("/search").get(searchSongs);
router.route("/new").post(newSong);

module.exports = router;

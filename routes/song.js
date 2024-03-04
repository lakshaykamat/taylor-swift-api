const express = require("express");
const {
  getAllSongs,
  newSong,
  searchSongs,
} = require("../controllers/songController");
const router = express.Router();

router.route("/").get(getAllSongs);
router.route("/search").get(searchSongs);
router.route("/new").post(newSong);

module.exports = router;

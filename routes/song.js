const express = require("express");
const {
  getAllSongs,
  newSong,
  searchSongs,
  getRandomSong,
  getSong,
  getSongsByAlbum,
} = require("../controllers/songController");
const router = express.Router();

router.route("/").get(getAllSongs);
router.route("/album/:albumName").get(getSongsByAlbum);
router.route("/random").get(getRandomSong);
router.route("/search").get(searchSongs);
router.route("/new").post(newSong);

router.route("/:songName").get(getSong);

module.exports = router;

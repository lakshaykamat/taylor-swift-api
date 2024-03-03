const express = require("express");
const Song = require("../models/Song");
const Album = require("../models/Album");
const { getAllSongs, newSong } = require("../controllers/songController");
const router = express.Router();

router.route("/").get(getAllSongs);
router.route("/new").post(newSong);

module.exports = router;

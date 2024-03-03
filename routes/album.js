const express = require("express");
const Album = require("../models/Album");
const Song = require("../models/Song");
const {
  getAllAlbums,
  deleteAlbum,
  newAlbum,
} = require("../controllers/albumController");
const router = express.Router();

router.route("/").get(getAllAlbums);
router.route("/:id").delete(deleteAlbum);
router.route("/newalbum").post(newAlbum);

module.exports = router;

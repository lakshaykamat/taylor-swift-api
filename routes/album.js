const express = require("express");
const {
  getAllAlbums,
  deleteAlbum,
  newAlbum,
  searchAlbum,
} = require("../controllers/albumController");
const router = express.Router();

router.route("/").get(getAllAlbums);
router.route("/search").get(searchAlbum);
router.route("/:id").delete(deleteAlbum);
router.route("/newalbum").post(newAlbum);

module.exports = router;

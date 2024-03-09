const express = require("express");
const {
  getAllAlbums,
  deleteAlbum,
  newAlbum,
  searchAlbum,
  getAlbum,
  getRandomAlbum,
} = require("../controllers/albumController");
const router = express.Router();

router.route("/").get(getAllAlbums);
router.route("/random").get(getRandomAlbum);
router.route("/newalbum").post(newAlbum);

router.route("/delete/:id").delete(deleteAlbum);
router.route("/:albumName").get(getAlbum);

module.exports = router;

const express = require("express");
const Song = require("../models/Song");
const Album = require("../models/Album");
const { getAllSongs, newSong } = require("../controllers/songController");
const router = express.Router();

router.route("/").get(getAllSongs);
router.route("/new").post(newSong);
// /**
//  * @route   GET /songs
//  * @desc    Get all songs
//  * @access  Public
//  */
// router.get("/", async (req, res) => {
//   try {
//     const songs = await getAllSongs();
//     return res.json(songs);
//   } catch (error) {
//     console.error("Error fetching songs:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// /**
//  * @route   POST /songs/new
//  * @desc    Create new songs and update associated album
//  * @access  Public
//  */
// router.post("/new", async (req, res) => {
//   try {
//     const songsData = req.body;
//     console.log(songsData);

//     // Ensure songsData is an array
//     if (!Array.isArray(songsData)) {
//       return res
//         .status(400)
//         .json({ error: "Invalid request. Expected an array of songs." });
//     }

//     const savedSongs = [];

//     for (const { name, artist, albumId, duration } of songsData) {
//       // Create a new song
//       const song = new Song({ name, artist, albumId, duration });
//       const savedSong = await song.save();

//       // Update the associated album with the new song's ID
//       const validAlbum = await getAlbum(albumId);

//       if (!validAlbum) {
//         return res.status(404).json({ error: "Album not found" });
//       }

//       // Add the new song's ID to the album's tracks array
//       validAlbum.tracks.push(savedSong._id);
//       await validAlbum.save();

//       savedSongs.push(savedSong);
//     }

//     res.json(savedSongs);
//   } catch (error) {
//     console.error("Error creating songs and updating album:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;

module.exports = router;

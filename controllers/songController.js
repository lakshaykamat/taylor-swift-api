const Song = require("../models/Song");
const Album = require("../models/Album");
const { isAdmin } = require("../utils");

const getSong = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ error: "Song not available" });
    }

    // Get album details without the tracks property
    const { title, albumCover, artist, releaseYear, realeaseDate } =
      await Album.findById(song.albumId.toString());
    const albumDetails = {
      title,
      albumCover,
      artist,
      releaseYear,
      realeaseDate,
    };

    res.json({
      ...song.toObject(), // Convert song to plain object
      album: albumDetails,
    });
  } catch (error) {
    console.error("Error fetching song:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    return res.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const newSong = async (req, res) => {
  try {
    const { songsData, user } = req.body;
    if (!user || !isAdmin(user.username, user.password)) {
      return res.status(403).send("Forbidden");
    }

    // Ensure songsData is an array
    if (!Array.isArray(songsData)) {
      return res
        .status(400)
        .json({ error: "Invalid request. Expected an array of songs." });
    }

    const savedSongs = [];

    for (const { name, artist, albumId, duration } of songsData) {
      // Create a new song
      const song = new Song({ name, artist, albumId, duration });
      const savedSong = await song.save();

      // Update the associated album with the new song's ID
      const validAlbum = await getAlbum(albumId);

      if (!validAlbum) {
        return res.status(404).json({ error: "Album not found" });
      }

      // Add the new song's ID to the album's tracks array
      validAlbum.tracks.push(savedSong._id);
      await validAlbum.save();

      savedSongs.push(savedSong);
    }

    res.json(savedSongs);
  } catch (error) {
    console.error("Error creating songs and updating album:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getSong,
  getAllSongs,
  newSong,
};

const Song = require("../models/Song");
const Album = require("../models/Album");
const { isAdmin } = require("../utils");

const getSong = async (req, res) => {
  try {
    const { name } = req.params;
    const song = await Song.findOne({ name })
      .select("-__v -_id") // Exclude unnecessary fields
      .lean();

    if (!song) {
      return res.status(404).json({ error: "Song not available" });
    }

    // Get album details without the tracks property
    const album = await Album.findById(song.albumId)
      .select("-__v -_id") // Exclude unnecessary fields
      .lean();

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    const albumDetails = {
      title: album.title,
      albumCover: album.albumCover,
      artist: album.artist,
      releaseYear: album.releaseYear,
      releaseDate: album.realeaseDate,
    };

    res.json({
      ...song,
      album: albumDetails,
    });
  } catch (error) {
    console.error("Error fetching song:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().select("-__v -_id").lean();

    for (const song of songs) {
      const album = await Album.findById(song.albumId)
        .select("-__v -_id")
        .lean();

      if (album) {
        song.albumName = album.title;
        delete song.albumId; // Remove the original albumId field
      }
    }

    res.json(songs);
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

    if (!Array.isArray(songsData) || songsData.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid request. Expected an array of songs." });
    }

    const savedSongs = [];

    for (const { name, artist, albumId, duration } of songsData) {
      const song = new Song({ name, artist, albumId, duration });
      const savedSong = await song.save();

      const validAlbum = await Album.findById(albumId);

      if (!validAlbum) {
        return res.status(404).json({ error: "Album not found" });
      }

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

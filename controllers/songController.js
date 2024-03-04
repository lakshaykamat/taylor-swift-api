const Song = require("../models/Song");
const Album = require("../models/Album");
const { isAdmin, getAlbumDetails } = require("../utils");

const getSong = async (req, res) => {
  try {
    const { name } = req.params;
    const song = await Song.findOne({ name: { $regex: name, $options: "i" } })
      .select("-__v -_id") // Exclude unnecessary fields
      .lean();

    if (!song) {
      return res.status(404).json({ error: "Song not available" });
    }

    // Get album details without the tracks property
    const albumDetails = await getAlbumDetails(song.albumId);

    if (!albumDetails) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json({
      ...song,
      album: albumDetails,
    });
  } catch (error) {
    console.error("Error fetching songs");
    errorHandler(res, error);
  }
};

const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().select("-__v -_id").lean();

    for (const song of songs) {
      // Use getAlbumDetails to get album details from albumId
      const albumDetails = await getAlbumDetails(song.albumId);

      if (albumDetails) {
        song.albumName = albumDetails.albumName;
        delete song.albumId; // Remove the original albumId field
      }
    }

    res.json(songs);
  } catch (error) {
    console.error("Error fetching songs");
    errorHandler(res, error);
  }
};

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
    console.error("Error creating a song and updating an album");
    errorHandler(res, error);
  }
};

module.exports = {
  getSong,
  getAllSongs,
  newSong,
};

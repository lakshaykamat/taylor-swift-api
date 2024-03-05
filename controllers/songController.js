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
    const { albumName, albumCover, artist, releaseDate } =
      await getAlbumDetails(song.albumId);

    if (!albumName) {
      return res.status(404).json({ error: "Album not found" });
    }
    delete song.albumId;

    res.json({
      ...song,
      album: albumName,
    });
  } catch (error) {
    console.error("Error fetching songs");
    errorHandler(res, error);
  }
};

const getRandomSong = async (req, res) => {
  try {
    const songs = await Song.find().select("-__v -_id").lean();
    const song = songs[Math.floor(Math.random() * songs.length)];
    if (!song) {
      return res.status(404).json({ error: "Song not available" });
    }
    // Get album details without the tracks property
    const { albumName, albumCover, artist, releaseDate } =
      await getAlbumDetails(song.albumId);

    if (!albumName) {
      return res.status(404).json({ error: "Album not found" });
    }
    delete song.albumId;
    res.json({
      ...song,
      album: albumName,
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

const searchSongs = async (req, res) => {
  const { name } = req.query;

  try {
    // Use a regular expression to perform a case-insensitive search
    const songs = await Song.find({ name: { $regex: name, $options: "i" } })
      .select("-__v -_id")
      .lean();

    // Fetch additional album details for each song
    const songsWithAlbum = await Promise.all(
      songs.map(async (song) => {
        const albumDetails = await getAlbumDetails(song.albumId);

        if (albumDetails) {
          song.albumName = albumDetails.albumName;
          delete song.albumId;
        }

        return song;
      })
    );

    res.json(songsWithAlbum);
  } catch (error) {
    console.error("Error searching songs:", error.message);
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

    for (const { name, artist, albumId, duration, lyrics } of songsData) {
      const song = new Song({ name, artist, albumId, duration, lyrics });
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
  searchSongs,
  getRandomSong,
};

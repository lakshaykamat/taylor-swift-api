const Song = require("../models/Song");
const Album = require("../models/Album");
const { isAdmin } = require("../utils");
const errorHandler = require("../middlewares/errorMiddleware");
const HTTP_STATUS_CODES = require("../constants/HttpStatusCodes");

/**
 * Get details of a song by its name
 */
const getSong = async (req, res) => {
  try {
    const { songName } = req.params;
    const song = await Song.findOne({ name: songName })
      .select("-__v -_id -albumId")
      .lean();

    if (!song) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "Song not available" });
    }

    return res.status(HTTP_STATUS_CODES.OK).json(song);
  } catch (error) {
    console.error("Error fetching songs:", error.message);
    errorHandler(res, error);
  }
};

/**
 * Get a random song
 */
const getRandomSong = async (req, res) => {
  try {
    const songs = await Song.find().select("-__v -_id -albumId");
    const song = songs[Math.floor(Math.random() * songs.length)];

    if (!song) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "Song not found" });
    }

    res.status(HTTP_STATUS_CODES.OK).json(song);
  } catch (error) {
    console.error("Error fetching songs:", error.message);
    errorHandler(res, error);
  }
};

/**
 * Get songs by album name
 */
const getSongsByAlbum = async (req, res) => {
  try {
    const { albumName } = req.params;
    const songs = await Song.find({ album: albumName }).select(
      "-__v -_id -albumId"
    );
    return res.status(HTTP_STATUS_CODES.OK).json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error.message);
    errorHandler(res, error);
  }
};

/**
 * Get details of all songs
 */
const getAllSongs = async (req, res) => {
  try {
    const { songName } = req.query;

    if (songName) {
      const albums = await Song.find({
        name: { $regex: songName, $options: "i" },
      }).select("-__v -_id -albumId");
      return res.status(HTTP_STATUS_CODES.OK).json(albums);
    }

    const songs = await Song.find().select("-__v -_id -albumId");
    return res.status(HTTP_STATUS_CODES.OK).json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error.message);
    errorHandler(res, error);
  }
};

/**
 * Search songs based on the provided query name
 */
const searchSongs = async (req, res) => {
  const { name } = req.query;

  try {
    const songs = await Song.find({
      name: { $regex: name, $options: "i" },
    }).select("-__v -_id -albumId");
    return res.status(HTTP_STATUS_CODES.OK).json(songs);
  } catch (error) {
    console.error("Error searching songs:", error.message);
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

/**
 * Create new song(s)
 */
const newSong = async (req, res) => {
  try {
    const { songsData, user, albumId } = req.body;

    // Check user credentials
    if (!user || !isAdmin(user.username, user.password)) {
      return res.status(HTTP_STATUS_CODES.FORBIDDEN).send("Forbidden");
    }

    // Check if the album exists
    const specifedAlbum = await Album.findById(albumId);
    if (!specifedAlbum) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "Album not found" });
    }

    // Check if songsData is a valid array
    if (!Array.isArray(songsData) || songsData.length === 0) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: "Invalid request. Expected an array of songs." });
    }

    // Create and save each song
    for (const {
      name,
      artist,
      albumId,
      duration,
      lyrics,
      album,
    } of songsData) {
      const existingSong = await Song.findOne({ name });
      if (existingSong) {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ error: `Song exists with this name:"${name}"` });
      }
      const song = new Song({ name, artist, albumId, duration, lyrics, album });
      const savedSong = await song.save();

      // Add the new song's ID to the album's tracks array
      specifedAlbum.tracks.push(savedSong._id);
    }

    // Save the updated album with the new songs
    await specifedAlbum.save();

    res.json(specifedAlbum);
  } catch (error) {
    console.error(
      "Error creating a song and updating an album:",
      error.message
    );
    errorHandler("Error creating a song and updating an album:", res, error);
  }
};

module.exports = {
  getSong,
  getAllSongs,
  newSong,
  searchSongs,
  getRandomSong,
  getSongsByAlbum,
};

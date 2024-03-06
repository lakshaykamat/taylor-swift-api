const Song = require("../models/Song");
const Album = require("../models/Album");
const { isAdmin, getAlbumDetails } = require("../utils");
const errorHandler = require("../middlewares/errorMiddleware");

/**
 * Get details of a song by its name
 */
const getSong = async (req, res) => {
  try {
    const { name } = req.params;
    const song = await Song.findOne({ name: { $regex: name, $options: "i" } })
      .select("-__v -_id")
      .lean();

    if (!song) {
      return res.status(404).json({ error: "Song not available" });
    }

    // Get album details without the tracks property
    const { albumName, albumCover, artist, releaseDate } =
      await getAlbumDetails(song.albumId);

    song.album = {
      name: albumName,
      coverImage: albumCover,
      artist: artist,
      releaseDate: releaseDate,
    };
    delete song.albumId;

    res.json(song);
  } catch (error) {
    console.error("Error fetching songs");
    errorHandler(res, error);
  }
};

/**
 * Get a random song
 */
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

    song.album = {
      name: albumName,
      coverImage: albumCover,
      artist: artist,
      releaseDate: releaseDate,
    };
    delete song.albumId;

    res.json(song);
  } catch (error) {
    console.error("Error fetching songs");
    errorHandler(res, error);
  }
};

/**
 * Get details of all songs
 */
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().select("-__v -_id").lean();

    for (const song of songs) {
      const { albumName, albumCover, artist, releaseDate } =
        await getAlbumDetails(song.albumId);

      song.album = {
        name: albumName,
        coverImage: albumCover,
        artist: artist,
        releaseDate: releaseDate,
      };
      delete song.albumId;
    }

    res.json(songs);
  } catch (error) {
    console.error("Error fetching songs");
    errorHandler(res, error);
  }
};

/**
 * Search songs based on the provided query name
 */
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
        const { albumName, albumCover, artist, releaseDate } =
          await getAlbumDetails(song.albumId);
        song.album = {
          name: albumName,
          coverImage: albumCover,
          artist: artist,
          releaseDate: releaseDate,
        };
        delete song.albumId;

        return song;
      })
    );

    res.json(songsWithAlbum);
  } catch (error) {
    console.error("Error searching songs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(403).send("Forbidden");
    }

    // Check if the album exists
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    // Check if songsData is a valid array
    if (!Array.isArray(songsData) || songsData.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid request. Expected an array of songs." });
    }

    const savedSongs = [];

    // Create and save each song
    for (const { name, artist, duration, lyrics } of songsData) {
      const song = new Song({ name, artist, albumId, duration, lyrics });
      const savedSong = await song.save();

      // Add the new song's ID to the album's tracks array
      album.tracks.push(savedSong._id);
    }

    // Save the updated album with the new songs
    await album.save();

    res.json(album);
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

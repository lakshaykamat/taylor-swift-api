const Album = require("../models/Album");
const Song = require("../models/Song");
const { isAdmin } = require("../utils");

const getAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id).lean();

    if (!album) {
      return res.status(404).send("Album not found");
    }

    const songPromises = album.tracks.map((songId) =>
      Song.findById(songId.toString()).lean()
    );
    const songs = await Promise.all(songPromises);
    album.tracks = songs.filter((song) => song !== null);

    res.json(album);
  } catch (error) {
    console.error("Error fetching album:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find({}).lean();

    for (const album of albums) {
      const songPromises = album.tracks.map((songId) =>
        Song.findById(songId.toString()).lean()
      );
      const songs = await Promise.all(songPromises);
      album.tracks = songs.filter((song) => song !== null);
    }

    return res.json(albums);
  } catch (error) {
    console.error("Error fetching all albums:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    if (!user || !isAdmin(user.username, user.password)) {
      return res.status(403).send("Forbidden");
    }

    // Find the album by ID and populate the tracks field
    const albumToDelete = await Album.findById(id).populate("tracks");

    if (!albumToDelete) {
      return res.status(404).json({ error: "Album not found" });
    }

    // Delete the associated songs
    const songIdsToDelete = albumToDelete.tracks.map((song) => song._id);
    await Song.deleteMany({ _id: { $in: songIdsToDelete } });

    // Delete the album
    await Album.findByIdAndDelete(id);

    res.json({ message: "Album and associated songs deleted successfully" });
  } catch (error) {
    console.error("Error deleting album and associated songs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const newAlbum = async (req, res) => {
  try {
    const { title, artist, releaseYear, releaseDate, albumCover, user } =
      req.body;
    if (!user || !isAdmin(user.username, user.password)) {
      return res.status(403).send("Forbidden");
    }
    const newAlbum = new Album({
      title,
      artist,
      releaseYear,
      releaseDate,
      albumCover,
      tracks: [],
    });

    const savedAlbum = await newAlbum.save();

    res.json(savedAlbum);
  } catch (error) {
    console.error("Error creating album:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getAllAlbums,
  deleteAlbum,
  newAlbum,
  getAlbum,
};

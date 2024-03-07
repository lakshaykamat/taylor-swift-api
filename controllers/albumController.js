const Album = require("../models/Album");
const Song = require("../models/Song");
const { isAdmin, enhanceAlbumWithSongsData } = require("../utils");
const errorHandler = require("../middlewares/errorMiddleware");

const getAlbum = async (req, res) => {
  try {
    const { name } = req.params;
    const album = await Album.findOne({ title: name })
      .select("-__v")
      .select("-_id")
      .lean();

    if (!album) {
      return res.status(404).send("Album not found");
    }

    res.json(await enhanceAlbumWithSongsData(album));
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find({}).lean().select("-__v").select("-_id");

    for (let album of albums) {
      album = await enhanceAlbumWithSongsData(album);
    }

    return res.json(albums);
  } catch (error) {
    errorHandler(res, error);
  }
};

const searchAlbum = async (req, res) => {
  const { name } = req.query;

  try {
    // Use a regular expression to perform a case-insensitive search
    const albums = await Album.find({ title: { $regex: name, $options: "i" } })
      .select("-__v -_id")
      .lean();

    for (let album of albums) {
      album = await enhanceAlbumWithSongsData(album);
    }

    res.json(albums);
  } catch (error) {
    console.error("Error searching albums:", error.message);
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

    const albumToDelete = await Album.findById(id).populate("tracks");

    if (!albumToDelete) {
      return res.status(404).json({ error: "Album not found" });
    }

    const songIdsToDelete = albumToDelete.tracks.map((song) => song._id);
    await Song.deleteMany({ _id: { $in: songIdsToDelete } });

    await Album.findByIdAndDelete(id).exec();

    res.json({ message: "Album and associated songs deleted successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
const getRandomAlbum = async (req, res) => {
  try {
    const albums = await Album.find({}).lean().select("-__v").select("-_id");
    let album = albums[Math.floor(Math.random() * albums.length)];

    album = await enhanceAlbumWithSongsData(album);

    return res.json(album);
  } catch (error) {
    errorHandler(res, error);
  }
};
const newAlbum = async (req, res) => {
  try {
    const { title, artist, releaseDate, albumCover, user } = req.body;
    if (!user || !isAdmin(user.username, user.password)) {
      return res.status(403).send("Forbidden");
    }
    const newAlbum = new Album({
      title,
      artist,
      releaseDate,
      albumCover,
      tracks: [],
    });

    const savedAlbum = await newAlbum.save();

    res.json(savedAlbum);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getRandomAlbum,
  getAllAlbums,
  deleteAlbum,
  newAlbum,
  getAlbum,
  searchAlbum,
};

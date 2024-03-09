const Album = require("../models/Album");
const Song = require("../models/Song");
const { isAdmin } = require("../utils");
const errorHandler = require("../middlewares/errorMiddleware");
const HTTP_STATUS_CODES = require("../constants/HttpStatusCodes");

const getAlbum = async (req, res) => {
  try {
    const { albumName } = req.params;
    const album = await Album.findOne({ title: albumName }).select(
      "-__v -_id -tracks"
    );

    if (!album) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).send("Album not found");
    }

    return res.status(HTTP_STATUS_CODES.OK).json(album);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllAlbums = async (req, res) => {
  const { albumName } = req.query;
  try {
    if (albumName) {
      const albums = await Album.find({
        title: { $regex: albumName, $options: "i" },
      }).select("-__v -_id -tracks");
      return res.status(HTTP_STATUS_CODES.OK).json(albums);
    }
    const albums = await Album.find({}).lean().select("-__v -_id -tracks");

    return res.status(HTTP_STATUS_CODES.OK).json(albums);
  } catch (error) {
    errorHandler(res, error);
  }
};

const searchAlbum = async (req, res) => {
  const { name } = req.query;

  try {
    const albums = await Album.find({
      title: { $regex: name, $options: "i" },
    }).select("-__v -_id -tracks");

    res.status(HTTP_STATUS_CODES.OK).json(albums);
  } catch (error) {
    console.error("Error searching albums:", error.message);
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    if (!user || !isAdmin(user.username, user.password)) {
      return res.status(HTTP_STATUS_CODES.FORBIDDEN).send("Forbidden");
    }

    const albumToDelete = await Album.findById(id).populate("tracks");

    if (!albumToDelete) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "Album not found" });
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
    const albums = await Album.find().select("-__v -id -tracks");
    const album = albums[Math.floor(Math.random() * albums.length)];
    if (!album) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "Song not found" });
    }
    return res.status(HTTP_STATUS_CODES.OK).json(album);
  } catch (error) {
    errorHandler(res, error);
  }
};

const newAlbum = async (req, res) => {
  try {
    const { title, artist, releaseDate, albumCover, user } = req.body;
    if (!user || !isAdmin(user.username, user.password)) {
      return res.status(HTTP_STATUS_CODES.FORBIDDEN).send("Forbidden");
    }

    const existingAlbum = await Album.findOne({ title: title });
    if (existingAlbum) {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        error: `Album exist with this title:${title}`,
      });
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
    errorHandler("Unable to Create Album", res, error);
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

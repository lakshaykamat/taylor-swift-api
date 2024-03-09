const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  artist: {
    type: String,
    required: true,
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
  },
  album: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  lyrics: {
    type: String,
    required: true,
  },
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;

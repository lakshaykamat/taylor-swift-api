const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  albumCover: {
    type: String,
    requried: true,
  },
  artist: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Array,
    required: true,
  },
  tracks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
});

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;

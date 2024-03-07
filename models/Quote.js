const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
  },
  song: {
    type: String,
    requried: true,
  },
  album: {
    type: String,
    required: true,
  },
});

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;

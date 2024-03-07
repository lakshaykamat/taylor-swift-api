const Quote = require("../models/Quote");
const getAlbumQuotes = async (albumName) => {
  const quotes = await Quote.find({ album: albumName })
    .select("-__v")
    .select("-_id");
  return quotes;
};
const randomQuoteByAlbum = async (albumName) => {
  const quotes = await Quote.find({ album: albumName })
    .select("-__v")
    .select("-_id");
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return quote;
};

const randomQuoteBySong = async (songName) => {
  const quotes = await Quote.find({ song: songName })
    .select("-__v")
    .select("-_id");
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return quote;
};
const getAllSongQuote = async (songName) => {
  const quotes = await Quote.find({ song: songName })
    .select("-__v")
    .select("-_id");

  return quotes;
};
const randomQuote = async () => {
  const quotes = await Quote.find().select("-__v").select("-_id");
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return quote;
};
const allQuotes = async () => {
  const quotes = await Quote.find().select("-__v").select("-_id");
  return quotes;
};

module.exports = {
  getAlbumQuotes,
  randomQuote,
  randomQuoteByAlbum,
  randomQuoteBySong,
  getAllSongQuote,
  allQuotes,
};

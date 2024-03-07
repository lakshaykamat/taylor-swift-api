const errorHandler = require("../middlewares/errorMiddleware");
const {
  randomQuoteBySong,
  randomQuoteByAlbum,
  getAllSongQuote,
  getAlbumQuotes,
  randomQuote,
  allQuotes,
} = require("../utils/quotes");

const getRandomQuote = async (req, res) => {
  try {
    const { album, song } = req.query;
    if (song) {
      return res.status(200).json(await randomQuoteBySong(song));
    }
    if (album) {
      return res.status(200).json(await randomQuoteByAlbum(album));
    }

    res.status(200).json(await randomQuote());
  } catch (error) {
    console.log();
    errorHandler("Error: fetching all quotes", res, error);
  }
};

const getAllQuotes = async (req, res) => {
  try {
    const { album, song } = req.query;
    if (song) {
      return res.status(200).json(await getAllSongQuote(song));
    }
    if (album) {
      return res.status(200).json(await getAlbumQuotes(album));
    }
    res.status(200).json(await allQuotes());
  } catch (error) {
    console.log();
    errorHandler("Error: fetching all quotes", res, error);
  }
};

module.exports = { getAllQuotes, getRandomQuote };

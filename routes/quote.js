const express = require("express");
const {
  getAllQuotes,
  getRandomQuote,
} = require("../controllers/quoteController");
const router = express.Router();

router.route("/").get(getRandomQuote);
router.route("/all").get(getAllQuotes);

module.exports = router;

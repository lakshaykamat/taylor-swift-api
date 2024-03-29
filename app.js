const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectToMongoDB = require("./database");
const setHeaderInformation = require("./middlewares/setHeaderInformation");
const app = express();
const port = 3000;

connectToMongoDB(); // Connect to the database

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json()); // Parse JSON requests

app.use("/api/images", express.static(path.join(__dirname, "/public/images"))); // Serve static files from the images folder

app.set("view engine", "ejs"); // Serve static files from the images folder
app.set("views", path.join(__dirname, "views")); // Specify the views directory

app.get("/api", async (req, res) => {
  const githubLink = "https://github.com/lakshaykamat/taylor-swift-api";
  const credist = [
    { name: "Lakshay Kamat", githubLink: "https://github.com/lakshaykamat" },
    { name: "Ruchi Singh", githubLink: "https://github.com/ruchisingh-dev" },
  ];
  // Render the EJS template with the data
  res.render("index", {
    appName: "Taylor Swift API",
  });
});
app.use(setHeaderInformation); // Set Header information to all routes

app.use("/api/albums", require("./routes/album"));
app.use("/api/songs", require("./routes/song"));
app.use("/api/quotes", require("./routes/quote"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;

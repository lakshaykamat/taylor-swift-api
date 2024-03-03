const express = require("express");
const bodyParser = require("body-parser"); // Required for parsing request bodies
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectToMongoDB = require("./database");
const Song = require("./models/Song");
const Album = require("./models/Album");
const { getAlbum } = require("./controllers/albumController");
const { getSong } = require("./controllers/songController");
const app = express();
const port = 3000;

connectToMongoDB(); // Connect to the database

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json()); // Parse JSON requests

// Specify the path to the images folder
const imagesPath = path.join(__dirname, "/public/images");
// Serve static files from the images folder
app.use("/images", express.static(imagesPath));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Specify the directory where your views/templates are located (optional)
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  try {
    // Fetch the albums data from your database
    const albums = await Album.find({}, "title releaseYear").lean();
    // Render the EJS template with the data
    res.render("index", {
      appName: "Taylor Swift API",
      albums: albums,
    });
  } catch (error) {
    console.error("Error fetching albums:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Use routes from separate files
app.use("/albums", require("./routes/album"));
app.use("/songs", require("./routes/song"));

app.get("/album/:name", getAlbum);
app.get("/song/:name", getSong);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

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

app.use("/images", express.static(path.join(__dirname, "/public/images"))); // Serve static files from the images folder

app.set("view engine", "ejs"); // Serve static files from the images folder
app.set("views", path.join(__dirname, "views")); // Specify the views directory

function myFunction() {
  // Your function logic goes here
  console.log("Function is running...");
}

// Run the function after 10 seconds
setTimeout(function () {
  // Run the function immediately
  myFunction();

  // Then run it every 10 seconds
  setInterval(myFunction, 5000); // 10000 milliseconds = 10 seconds
}, 5000); // 10000 milliseconds = 10 seconds

app.get("/", async (req, res) => {
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

app.use("/albums", require("./routes/album"));
app.use("/songs", require("./routes/song"));
app.use("/quotes", require("./routes/quote"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

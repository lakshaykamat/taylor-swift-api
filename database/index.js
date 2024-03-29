const mongoose = require("mongoose");
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to Database :)");

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
module.exports = connectToMongoDB;

const mongoose = require("mongoose");
async function connectToMongoDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://lakshaykamat:BYDI2PagYuedUdR2@cluster0.vrcfekl.mongodb.net/"
    );

    console.log("Connected to Database :)");

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
module.exports = connectToMongoDB;

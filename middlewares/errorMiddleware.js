const errorHandler = (message = null, res, error, status = 500) => {
  if (message) console.log(message);
  console.error("Error:", error.message);
  res.status(status).json({ error: "Internal Server Error" });
};

module.exports = errorHandler;

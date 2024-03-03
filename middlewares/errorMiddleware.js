const errorHandler = (res, error, status = 500) => {
  console.error("Error:", error.message);
  res.status(status).json({ error: "Internal Server Error" });
};

module.exports = errorHandler;

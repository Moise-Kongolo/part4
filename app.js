// importations
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");

// middleware
app.use(express.json());
morgan.token("data", (request) => JSON.stringify(request.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data"),
);
app.use(cors());
app.use("/api/blogs", blogsRouter);

// db connection
mongoose.set("strictQuery", false);
const mongoUrl = config.MONGODB_URI;
logger.info("connecting to", mongoUrl);
mongoose
  .connect(mongoUrl)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) => logger.error("Error connecting to MongoDB", error.message));

// export
module.exports = app;

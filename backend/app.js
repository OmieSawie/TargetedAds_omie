require("dotenv").config();
const MongoStore = require("connect-mongo");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

const advertisementRouter = require("./routes/advertisementRoutes");
const userRouter = require("./routes/userRoutes");

const MONGO_URI = process.env.mongo_uri;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

require('./models/advertisementModel');
require('./models/userModel');



app.use("/api/v1/advertisement", advertisementRouter);
app.use("/api/v1/user", userRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

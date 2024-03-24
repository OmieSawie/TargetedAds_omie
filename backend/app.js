require("dotenv").config();
const MongoStore = require("connect-mongo");
const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

const advertisementRouter = require("./routes/advertisementRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

const MONGO_URI = process.env.mongo_uri;
const SECRET_KEY = "keyboardcat";

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.json());
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

// Session storage configuration
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      dbName: "sessions",
      autoRemove: 'interval',
      autoRemoveInterval: 1000,
    }),
    cookie: {
      // 1000 minutes age for cookies, debug setting
      maxAge: 1000 * 60 * 1000,
      secure: app.get("env") === "production",
    },
     })
);




require("./models/advertisementModel");
require("./models/userModel");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/advertisements", advertisementRouter);
app.use("/api/v1/user", userRouter);


module.exports = app;

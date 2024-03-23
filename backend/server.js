//Requiring app.js also runs dotenv.config(), so no need to run it again
const app = require("./app.js");
const mongoose = require("mongoose");

const port = process.env.PORT || 8000;

//Adding Mongodb url
const MONGO_URI = process.env.mongo_uri;

//Connect server to mongodb
mongoose
  .connect(MONGO_URI, {
  })
  .then(() => {
    console.log("Connected to MongoDB!");
    console.log("Starting webserver..");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB server! Shutting down...");
    console.log(err);
  });

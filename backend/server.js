// //Requiring app.js also runs dotenv.config(), so no need to run it again
// const app = require("./app.js");
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const mongoose = require("mongoose");
//
// const port = process.env.PORT || 8000;
//
// //Adding Mongodb url
// const uri = process.env.mongo_uri;
//
//
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



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

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// mondoDB connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2hyf2gq.mongodb.net/?retryWrites=true&w=majority`;

/* const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  
  client.close();
}); */

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("gub_portal");
    const teacherCollection = database.collection("teachers");

    app.get("/teacher", async (req, res) => {
      const query = {};

      const cursor = teacherCollection.find(query);
      const teachers = await cursor.toArray();
      res.send(teachers);
    });
  } finally {
  }
}
run().catch(console.dir);

// mondoDB connection end

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(port, () => {
  console.log(`Server is listining from port ${port}`);
});

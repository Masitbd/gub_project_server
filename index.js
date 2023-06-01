const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { response } = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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
    const applicationCollection = database.collection("onlineApplications");

    // get api
    app.get("/teacher", async (req, res) => {
      const query = {};

      const cursor = teacherCollection.find(query);
      const teachers = await cursor.toArray();
      res.send(teachers);
    });

    app.get("/eee", async (req, res) => {
   
      const query = {department: 'Department of EEE'};
      const cursor = teacherCollection.find(query);
      const teachers = await cursor.toArray();
      res.send(teachers);
    });

    app.get("/applyOnline", async (req, res) => {
      const query = {};

      const cursor = applicationCollection.find(query);
      const onlineApplications = await cursor.toArray();
      res.send(onlineApplications);
    });

    // post api
  app.post("/teacher", async (req, res) => {
    const teacher = req.body;
    //console.log('hello data', teacher)
    const result = await teacherCollection.insertOne(teacher)
    res.send(result)
  });

  app.post("/applyOnline", async (req, res) => {
    const application = req.body;
    //console.log('hello data', teacher)
    const result = await applicationCollection.insertOne(application)
    res.send(result)
  });

  }
  finally {
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

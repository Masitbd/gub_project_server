const express = require("express");
const multer  = require('multer')
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { response } = require("express");
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' }); 
const fileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  data: Buffer,
  studentName: String,
  studentId: String,
  email: String,
  research: String
});
const File = mongoose.model('File', fileSchema);

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

    app.get("/cse", async (req, res) => {
   
      const query = {department: 'Department of CSE'};
      const cursor = teacherCollection.find(query);
     // console.log('hello',cursor)
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

  app.post("/applyOnline", upload.single('pdf'), async (req, res) => {
    //const application = req.body;

    const file = req.file;

    /* const newFile = new File({
      
      //mimetype: file.mimetype,
     // data: file.buffer,
      studentName: req.body.studentName,
      studentId: req.body.studentId,
      email: req.body.email,
      gender: req.body.gender,
      research: req.body.research,
      filename: file.filename,
    }); */
   //console.log(newFile);
    const result = await applicationCollection.insertOne({ studentName: req.body.studentName,
      studentId: req.body.studentId,
      email: req.body.email,
      gender: req.body.gender,
      research: req.body.research,
      filename: file.filename,})
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

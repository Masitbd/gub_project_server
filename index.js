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
    const usersCollection = database.collection("users");

    // get api
    app.get("/teacher", async (req, res) => {
      const query = {};

      const cursor = teacherCollection.find(query);
      const teachers = await cursor.toArray();
      res.send(teachers);
    });

    app.get("/student", async (req, res) => {
      const query = {};

      const cursor = applicationCollection.find(query);
      const student = await cursor.toArray();
      res.send(student);
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

    app.get("/users/:email", async (req, res) => {
     
   
      const email = req.params.email;
      const query = {email: email}
      const user = await usersCollection.findOne(query);
      let isAdmin = false
      if (user?.role ==='admin') {
        isAdmin = true
      }
      res.send({admin: isAdmin});
    });

    app.get("/applyOnline", async (req, res) => {
      const query = {};

      const cursor = applicationCollection.find(query);
      const onlineApplications = await cursor.toArray();
      res.send(onlineApplications);
    });

    app.get("/:teachername", async (req, res) => {
      // console.log('teacher name', req.params.teachername)
      const teacherName = req.params.teachername
      const query = {gender: teacherName};
      const cursor = applicationCollection.find(query);
      const onlineApplications = await cursor.toArray();
      res.send(onlineApplications);
    });

    app.get("/student/:studentname", async (req, res) => {
     // console.log('student name', req.params)
     //const studentName = req.params.studentName
     const studentName = req.params.studentname
     const query = {studentName: studentName};
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


  app.post("/users", async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user)
    res.send(result)
  });


  app.put("/users", async (req, res) => {
    const user = req.body;
   
    const filter = {email: user.email}
    const options = {upsert: true}
    const updateDoc = {$set: user}

    const result = await usersCollection.updateOne(filter, updateDoc, options)
    res.send(result)
  });


  app.put("/users/admin", async (req, res) => {
    const user = req.body.user;
   //console.log('hello admin', user);
    const filter = {email: user}
    const updateDoc = {$set: {role: 'admin'}}
    //console.log('filter', filter);

    const result = await usersCollection.updateOne(filter, updateDoc)
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

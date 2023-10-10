const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Helen of minitaure");
});

// console.log(process.env.user);
const uri = `mongodb+srv://${process.env.user}:${process.env.pass}@cluster0.w5hdwnt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toycollection = client.db("MiniatureElectic").collection("alltoys");

    // api to add tooy
    app.post("/addtoy", async (req, res) => {
      console.log(req.body);
      toyinfo = req.body;
      const result = await toycollection.insertOne(toyinfo);
      console.log(result);
      res.send(result);
    });

    // api to get toy

    app.get("/alltoys", async (req, res) => {
      const cursor = toycollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/alltoys/:subcategory", async (req, res) => {
      console.log(req.params.subcategory);

      // match your query with db subcategory
      const query = { subcategory: req.params.subcategory };
      const sub = await toycollection.find(query).toArray();
      // console.log(sub);
      res.send(sub);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`port is running on ${port}`);
});

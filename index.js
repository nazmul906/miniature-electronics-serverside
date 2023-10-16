const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
      // console.log("category", req.params.subcategory);

      // match your query with db subcategory
      const query = { subcategory: req.params.subcategory };
      const sub = await toycollection.find(query).limit(3).toArray();
      // console.log(sub);
      res.send(sub);
    });

    // singtoy for toy details api
    app.get("/singletoy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await toycollection.findOne(query);
      // console.log(result);
      res.send(result);
    });

    app.get("/searchbytoyname/:text", async (req, res) => {
      const text = req.params.text;
      // console.log(text);
      const result = await toycollection
        .find({ name: { $regex: text, $options: "i" } })
        .toArray();
      // console.log(result);
      res.send(result);
    });
    app.get("/alltoy", async (req, res) => {
      // console.log(req.query.email);
      const { email, order } = req.query;
      // console.log(req.query.email);
      // console.log(req.query.order);

      // let query = {};
      // if (req.query?.email) {
      //   query = { email: req.query.email };
      // }

      let query = {};
      if (email) {
        query.email = email;
      }
      const sortChoice = {};
      if (order === "ascending") {
        sortChoice.price = 1;
      } else if (order === "descending") {
        sortChoice.price = -1;
      }
      //previously sort({ price: 1 })
      const result = await toycollection.find(query).sort(sortChoice).toArray();
      // console.log(result);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      // console.log("update", id);
      const options = { upsert: true };
      const updatetoy = req.body;
      const updateDoc = {
        $set: {
          price: updatetoy.price,
          // rating: updatetoy.rating,
          quantity: updatetoy.quantity,
          description: updatetoy.description,
          // email: updatetoy.email,
          // pictureURL: updatetoy.pictureURL,
          // name: updatetoy.name,
          // sellerName: updatetoy.sellerName,
          // subcategory: updatetoy.subcategory
        },
      };

      const result = await toycollection.updateOne(filter, updateDoc, options);

      // console.log(result);
      res.send(result);
    });

    // delete
    app.delete("/singletoy/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await toycollection.deleteOne(query);
      res.send(result);
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

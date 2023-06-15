import express from "express";
// import connected database object
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();


// This section will help you get whether the tasklist is sorted by custom (DND) priority.
// The base here is /tasklist
// search based on firebaseUID
router.get("/", async (req, res) => {
    const firebaseUID = req.query.UID;
    let collection = await db.collection("tasklist");
    let results = await collection.find({firebaseUID: firebaseUID}).toArray();
    res.send(results).status(200);
  });

// This section will help you create by default a custom priority set to false.
router.post("/", async (req, res) => {
    let newDocument = {
        useCustomPriority: req.body.useCustomPriority,
    };
    let collection = await db.collection("tasklist");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  });

 // This section will help you update the custom priority.
router.patch("/", async (req, res) => {
    const firebaseUID = req.body.UID;
  const updates =  {
    $set: {
        useCustomPriority: req.body.useCustomPriority
    }
  };

  let collection = await db.collection("tasklist");
  let result = await collection.updateOne( {firebaseUID: firebaseUID}, updates, {upsert: true});

  res.send(result).status(200);
});

  export default router;
  
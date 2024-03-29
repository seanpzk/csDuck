import express from "express";
// import connected database object
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the records.
// The base here is /task
// search based on firebaseUID
router.get("/", async (req, res) => {
  const firebaseUID = req.query.UID;
  let collection = await db.collection("task");
  // let results = await collection.find({firebaseUID: firebaseUID}).sort({deadline: -1}).toArray();
  const useCustomPriority = req.query.UCP;

  let results = null;


  if (useCustomPriority === "true") {
    results = await collection.find({firebaseUID: firebaseUID}).sort({customPriority: 1}).toArray();
  } else {
    results = await collection.aggregate([
    {$match: {firebaseUID: firebaseUID}},
    {$addFields: {
     sortPriority: {
      $switch: {
       branches: [
        {
         'case': {
          $eq: [
           '$priority',
           'High'
          ]
         },
         then: 3
        },
        {
         'case': {
          $eq: [
           '$priority',
           'Medium'
          ]
         },
         then: 2
        },
        {
         'case': {
          $eq: [
           '$priority',
           'Low'
          ]
         },
         then: 1
        }
       ],
       'default': 0
      }
     }
    }
   }, {
    $sort: {
     sortPriority: -1,
     deadline: 1
    }
   }]).toArray();}
   console.log(results);
  res.status(200).send(results);
});

// This section will help you get a single record by MongoDB object_id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("task");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);
  if (!result) res.status(404).send("Not found");
  else res.status(200).send(result);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  let newDocument = {
    name: req.body.name,
    deadline: req.body.deadline,
    priority: req.body.priority,
    description: req.body.description,
    firebaseUID: req.body.firebaseUID,
    doBefore: req.body.doBefore,
    googleCalendarEventID: req.body.eventID
  };
  let collection = await db.collection("task");
  let result = await collection.insertOne(newDocument);
  res.status(200).send(result);
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  console.log(query);
  const updates =  {
    $set: {
      name: req.body.name,
      deadline: req.body.deadline,
      priority: req.body.priority,
      description: req.body.description,
      doBefore: req.body.doBefore,
      customPriority: req.body.customPriority,
    }
  };
  let taskCollection = await db.collection("task");
  const prevTask = await taskCollection.findOne(query);
  console.log(prevTask);
  let result = await taskCollection.updateOne(query, updates);
  if (result.modifiedCount > 0) {
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({firebaseUID: req.body.firebaseUID});
    if (user && user.currentTask == prevTask.name) {
      await usersCollection.updateOne({
        firebaseUID: req.body.firebaseUID
      }, {
        $set : {
          currentTask: req.body.name
        }
      })
    }
  } else {
    res.status(500);
  }

  res.status(200).send(result);
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  let currentTask = false;
  const collection = db.collection("task");
  const doc = await collection.findOne(query);
  const userCollection = db.collection("users");
  const user = await userCollection.findOne({firebaseUID: doc.firebaseUID});
  // delete current task only if the task is the current task
  if (user.currentTask == doc.name) {
    await userCollection.updateOne({firebaseUID: doc.firebaseUID}, 
      {$set: {currentTask: ""}});
    currentTask = true;
  }
  let result = await collection.deleteOne(query);
  res.status(200).json({isCurrentTask: currentTask});
});

export default router;
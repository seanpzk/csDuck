import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    const firebaseUID = req.query.UID;
    let collection = await db.collection("users");
    let results = await collection.find({$and: [{firebaseUID:firebaseUID}, {registration: true}]}).toArray();
    res.send(results).status(200);
})

router.patch("/", async(req, res) => {
    console.log(req.body.username)
    const firebaseUID = req.body.uid;  
    // const query = {$and: [{firebaseUID:firebaseUID}, {registration: true}]};
    const query = {firebaseUID:firebaseUID};
    const updates = {
        $set: {
            username: req.body.username,
            email: req.body.email,
            bio: req.body.bio,
        }
    };
    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200)
    console.log("updated results")
    console.log(result);
})


export default router;
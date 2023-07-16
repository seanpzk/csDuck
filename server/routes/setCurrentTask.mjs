import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

router.patch("/", async(req, res) => {
    const uid = req.body.firebaseUID;
    const taskName = req.body.name;
    const collection = await db.collection("users");
    collection.updateOne({firebaseUID: uid}, 
        {$set: {currentTask: taskName}})
        .then(doc => res.status(200).send({message: "successfully updated current Task"}))
        .catch(error => res.status(400).send({message: "Failed to update current Task"}));
});

export default router;
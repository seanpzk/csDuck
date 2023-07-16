import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
    const myUID = req.body.firebaseUID;
    const friendUID = req.body.friendId;
    // check if friendUID exists in db
    const friend = await db.collection("users")
        .findOne({firebaseUID: friendUID});
    if (!friend) {
        res.status(500).json({message: "No user with that UID found"});
        return;
    }
    const relationships = await db.collection("friend-relationships");
    const existingRelationships = relationships.find(
        { $or: [ { user1: myUID }, { user2 : myUID }]});
    let existingDoc = false;
    for await (const doc of existingRelationships) {
        if (doc.user1 == friendUID || doc.user2 == friendUID) {
            existingDoc = true;
            break;
        }
    }
    // insert new only when there is no repetition
    if (!existingDoc) {
        relationships.insertOne({
            user1 : myUID,
            user2 : friendUID
        });
        console.log("Insert new friend");
        res.status(200).json({message: "Successfully added friend"});
    } else {
        res.status(500).json({message: "Friend already exists!"});
    }
})

export default router;
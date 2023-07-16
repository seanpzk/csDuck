import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

// remove data from mongoDB
router.delete("/", async (req, res) => {
    const currentUserUID = req.query.currentUserUID;
    const friendUID = req.query.friendUID;
    const result = await db.collection("friend-relationships")
        .deleteMany({
            $or: [
                {$and : [{user1 : currentUserUID}, {user2 : friendUID}]},
                {$and : [{user1 : friendUID}, {user2 : currentUserUID}]}
            ]
        });
    if (result.deletedCount > 0) {
        res.status(200).json({message : "Deletion is successful"});
    } else {
        res.status(500).json({msesage : "No friend found"});
    }
});

export default router;
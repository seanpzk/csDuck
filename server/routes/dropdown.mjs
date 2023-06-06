import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    const firebaseUID = req.query.UID;
    const collection = await db.collection("task");
    let results = await collection
        .find({firebaseUID: firebaseUID})
        .toArray();
    res.send(results).status(200);
});

export default router;

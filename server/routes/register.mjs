import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();


// This section will help you create a new record.
router.post("/", async (req, res) => {
  let user = {
username: req.body.username,
password: req.body.password
  };

  let collection = await db.collection("users");
  let result = await collection.insertOne(user);
  res.send(result).status(204);
});

export default router;
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
  let result = await collection.find({username: user.username, password: user.password}).toArray();
  if (result.length === 0) {
    return res.status(404).send( {text: "Login failed"}) 
  } else {
    return res.status(200).send( {text: "Login success"})
  };

});

export default router;
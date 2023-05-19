import express from "express";
import db from "../db/conn.mjs";
import sha512 from "js-sha512";

const router = express.Router();

// handles the Register post request made to this /register
router.post("/", async(req, res) => {

    // create mongo document to store form data, sha512 to store data
    const newUser = {
        username: req.body.username,
        password: sha512(req.body.password)
    }

    const result = await db.collection("users")
        .insertOne(newUser)
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(error => {
            res.status(500).json(error);
        })
    res.send(result).status(200);
});

export default router;
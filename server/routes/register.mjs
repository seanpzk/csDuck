import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

// handles the Register post request made to this /register
router.post("/", async(req, res) => {

    // Insert new user into mongoDB
    const uid = req.body.UID;
    const newUser = {
        firebaseUID: req.body.firebaseUID,
        email: req.body?.email,
        registration: false,
        username: "",
        currentTask: ""
    }

    const userCollection = db.collection("users");
    userCollection.findOne({
        firebaseUID: req.body.firebaseUID
    }).then(user => {
        if (!user) {
            userCollection
            .insertOne(newUser)
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(error => {
                res.status(500).json(error);
            })
            console.log("CRETED NEW USER");
        } else {
            console.log("User already present in database");
        }
    })
});

router.patch("/", async(req, res) => {
    const uid = req.body.firebaseUID;
    console.log(req.body.username);
    const result = await db.collection("users")
        .updateOne({firebaseUID: uid},
            {$set: { username: req.body.username, 
                phoneNumber: req.body.phoneNumber,
                registration: true }})
                .then(doc => res.status(200).send({message: "success"}))
                .catch(error => res.status(400).send({message: "fail"}));
});

export default router;
import express from "express";
import db from "../db/conn.mjs";
import sha512 from "js-sha512";

const router = express.Router();

router.post("/", async(req, res) => {
    const newResetReq = {
        username: req.body.username,
        password: sha512(req.body.password)
    }
    
    db.collection("users")
        .updateOne( { username: req.body.username }, {$set: {username: newResetReq.username, password: newResetReq.password} })
        .then(doc => res.status(200).json(doc))
        .catch(error => {
            res.status(404).json(error);
        })
})

export default router;
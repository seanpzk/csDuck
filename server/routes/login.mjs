import express from "express";
import db from "../db/conn.mjs";
import sha512 from "js-sha512";

// added SHA512 hash to store password, may need to add salt to password
const router = express.Router();

router.post("/", async(req, res) => {

    // obtain login info from client

    const user = {
        username: req.body.username,
        password: sha512(req.body.password)
    }
    console.log(user.password);
    const result = await db.collection("users")
        .find( { username: user.username, password: user.password } )
        .toArray();
    if (result.length == 0) {
        console.log(result);
        res.status(404).send( {text: "Login failed"} );
    } else {
        console.log(result);
        res.status(200).send( {text: "login success" });
    }
})

export default router;
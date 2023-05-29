import express from "express";
import db from "../db/conn.mjs";
import sha512 from "js-sha512";

// added SHA512 hash to store password, may need to add salt to password
const router = express.Router();

router.post("/", async(req, res) => {

    // obtain login info from client

    const user = {
        email: req.body.email,
        password: sha512(req.body.password)
    }
    // ensures there is no existing email
    const result = await db.collection("users")
        .find( { email: user.email, password: user.password } )
        .toArray();
    if (result.length == 0) {
        res.status(401).send( {text: "Login failed"} );
    } else {
        res.status(200).send( {text: "login success" });
    }
})
export default router;
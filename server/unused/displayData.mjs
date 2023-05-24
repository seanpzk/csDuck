import express from "express";
import db from "../db/conn.mjs";
import sha512 from "js-sha512";

// added SHA512 hash to store password, may need to add salt to password
const router = express.Router();

router.post("/", async(req, res) => {

    res.status(200).send({message: "Success"});
})
export default router;
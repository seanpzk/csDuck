const express = require('express')
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    // mysql password is removed for this project
    password: "",
    database: "users",
});

app.post('/create', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("INSERT INTO users (username, password) VALUES (?, ?)", 
    [username, password], 
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Values inserted");
        }
    });
});

app.listen(3001, () => {
    console.log("Running on 3001");
});
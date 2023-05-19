import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
try {
  // connect to monogodb
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

// Connect to "sample-training" database 
// gives us the interface to communicate with database
let db = conn.db("csDuck");

export default db;
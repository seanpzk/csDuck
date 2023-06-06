import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import tasks from "./routes/task.mjs"
import registration from "./routes/register.mjs";
import login from "./routes/login.mjs";
import reset from "./routes/reset.mjs";
import decodeIDToken from "./authenticateToken.mjs";
import toposort from "./routes/toposort.mjs";
import dropdown from "./routes/dropdown.mjs";


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json()); // I suppose these two statements are middleware, which are invoked in every path
// Authentication middleware
app.use(decodeIDToken); // Runs on every request, use next() to run next middleware

app.use("/register", registration); // handle incoming request along this path
app.use("/login", login);
app.use("/reset", reset);
app.use("/task", tasks);
app.use("/toposort", toposort);
app.use("/dropdown", dropdown);


// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
# csDuck
Orbital project

## You may need to install cors to run this

```
npm install cors
```

## You also need to set up a mysql server 
<p>server should follow the convention stated in  "server/index.jsx" shown below here</p>

```
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    // mysql password is removed for this project
    password: "",
    database: "users",
});
```

## Run the application 
<p>1) cd planner; npm run dev<br>2) cd server; node index.jsx;</p>

import admin from "firebase-admin";
import { readFile } from "fs/promises";
//import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
// read json files manually, since es6 doesn't support
const json = JSON.parse(
    await readFile(
        new URL("./serviceAccountKey.json", import.meta.url)
    )
);

admin.initializeApp({
  credential: admin.credential.cert(json)
});

// verify Firebase token
export default async function decodeIDToken(req, res, next) {
    const header = req.headers?.authorization;
    if (header && header != "Bearer null" && req.headers?.authorization?.startsWith("Bearer ")) {
        const idToken = req.headers.authorization.split("Bearer ")[1];
        try {
            const decodedToken = await admin.auth()?.verifyIdToken(idToken);
            req["currentUser"] = decodedToken;
        } catch (error) {
            console.log(idToken);
            console.log(error);
            console.log("Request not authenticated");
            // "return" prevents double response <--> Error here, need to find a better way to send to frontend, then redirect.
            // return res.redirect(`http://localhost:5173/`);
            // return here will stop further execution of the middleware stack
            return res.status(401).json( {url: "/login"});
        }
        next();
    } else {
        return res.status(401).json({message: "Error! Unauthorised access!"});
    }
}

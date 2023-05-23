import admin from "firebase-admin";

import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// verify Firebase token
export default async function decodeIDToken(req, res, next) {
    const header = req.headers?.authorization;
    if (header != "Bearer null" && req.headers?.authorization?.startsWith("Bearer ")) {
        const idToken = req.headers.authorization.split("Bearer ")[1];
        console.log("Next line is the authentication token");
        console.log(idToken);
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req["currentUser"] = decodedToken;
        } catch (error) {
            console.log(error);
            window.alert("Unauthorised, please login!");
        }
    }
    next();
}

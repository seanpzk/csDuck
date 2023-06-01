import firebaseAuth from "../../firebase.config";
import { backendURL } from "./serverUrl";

export default async function CreateUserMongo() {

  const user = firebaseAuth?.currentUser;
  const idToken = await user.getIdToken();
  console.log("JWT TOKEN: " + idToken);
  
  await fetch(`${backendURL}/register`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + idToken,  
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseUID: user.uid, 
        email: user.email
      }),
  })
  .catch((error) => {
      window.alert(error);
      return;
  })
}
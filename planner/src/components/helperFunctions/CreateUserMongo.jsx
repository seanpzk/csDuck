import firebaseAuth from "../../firebase.config";
import { backendURL } from "./serverUrl";

/**
 * Creates a POST request to create user in MongoDB
 * @return {void}
 */
export default async function CreateUserMongo() {
  const user = firebaseAuth?.currentUser;
  const idToken = await user.getIdToken();
  console.log(idToken);

  await fetch(`${backendURL}/register`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + idToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firebaseUID: user.uid,
      email: user.email,
    }),
  }).catch((error) => {
    window.alert(error);
    return;
  });
}

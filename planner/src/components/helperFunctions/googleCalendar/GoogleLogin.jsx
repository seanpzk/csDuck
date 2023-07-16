import firebaseAuth from "../../../firebase.config";
import { backendURL } from "../serverUrl";
import { useNavigate } from "react-router-dom";
export default async function GoogleLogin(e) {
  const navigate = useNavigate();
  e.preventDefault;
  const idToken = await firebaseAuth.currentUser?.getIdToken();
  await fetch(`${backendURL}/googlelogin`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + idToken,
    },
  });
}

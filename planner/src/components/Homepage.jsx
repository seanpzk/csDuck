import TaskList from "./TaskList";
import RecordList from "./RecordList";
import { getAuth, } from "firebase/auth";
import firebaseAuth from "../firebase.config";

export default function Homepage(props) {

    async function displayData() {
        console.log("Clicked");
        const idToken = await firebaseAuth.currentUser?.getIdToken();
        await fetch("http://localhost:5050/displayData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + idToken,
            },
            body: JSON.stringify({message: "Hello there"}),
        }).then((response) => {
            if (response.ok) {
                const rep = response.json().then(msg => console.log(msg.message));
                return rep;
            } else {
              throw new Error("An error occured during login, Please try again!");
            }
          }).catch((error) => {
            window.alert(error);
            return;
        });
    }

  return (
    <>
      <div>Some advertising stuff here</div>
      <TaskList />
            {
                props.auth
                ? <h1>Display data <button onClick = {displayData}>here</button></h1>
                : <></>
            }
    </>
  );
}

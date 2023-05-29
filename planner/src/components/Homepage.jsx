import TaskList from "./TaskList";
import firebaseAuth from "../firebase.config";
import { sendEmailVerification } from "firebase/auth";
import { NavLink } from "react-router-dom";

export default function Homepage(props) {

    function displayEmailValid() {
      const user = firebaseAuth.currentUser;
      if (user && !user.emailVerified) {
        return (
          <button className="verificationTag" onClick = {event => sendEmailVerification(user).catch(error => console.log(error))}>Click here to verify your email</button>
        )
      }
      return <h1>user</h1>;
    }

  return (
    <>
      <div>Some advertising stuff here</div>
      {
        props.auth
          ? <TaskList />
          : <></>
      }
      {
        displayEmailValid()
      }
    </>
  );
}

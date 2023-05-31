import { useState, React, useEffect } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import firebaseAuth from "../firebase.config";
import { backendURL } from "./helperFunctions/serverUrl";

export default function Register() {
  const navigate = useNavigate();
  const [newUserCreated, updateUser] = useState(null);

  const [creationForm, setForm] = useState({
    email: "",
    password: "",
  });

  // value passed here is an object
  const updateForm = (value) => {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  };

    async function handleEmailPwCreation() {
      await createUserWithEmailAndPassword(firebaseAuth, creationForm.email, creationForm.password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          updateUser(user);
          console.log("registered with email and password");
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    }

    async function verifyEmail() {
      await sendEmailVerification(newUserCreated)
        .then(console.log("Email verification sent"))
        .catch(error => console.log(error));
    }

    // Runs when a new user is registered
    useEffect(() => {
      if (newUserCreated) {
        verifyEmail();
      } 
    }, [newUserCreated]);

    async function handleSubmit(event) {
        event.preventDefault();
        await handleEmailPwCreation();
        const newUser = creationForm;
        const idToken = await firebaseAuth.currentUser?.getIdToken();

        await fetch(`${backendURL}/register`, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + idToken,  
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firebaseUID: firebaseAuth.currentUser.uid, 
              email: creationForm.email
            }),
        })
        .catch((error) => {
            window.alert(error);
            return;
        })
        // resets the form once submitted
        setForm({ email: "", password: "" });
        event.target.reset();
    }

  return (
    <>
      <div className="register">
        <form className="register-style-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            name="password"
            id="email"
            value={creationForm.email}
            placeholder="Your email"
            onChange={(event) => updateForm({ email: event.target.value })}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="text"
            name="password"
            id="password"
            value={creationForm.password}
            placeholder="Your password"
            onChange={(event) => updateForm({ password: event.target.value })}
          />
          <button type="submit" className="btn btn-light">
            Create user
          </button>
        </form>
        <NavLink style={{ color: "white" }} to="/login">
          Already have an account? Login here.
        </NavLink>
      </div>
    </>
  );
}

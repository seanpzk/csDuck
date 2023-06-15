import { useState, React, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import firebaseAuth from "../firebase.config";
import CreateUserMongo from "./helperFunctions/CreateUserMongo.jsx";

/**
 * Component that handles the registration of a new user via email and password.
 * 
 * @returns {React.ReactElement} - The registration form page
 */
export default function Register() {

  const [newUserCreated, updateUser] = useState(null);
  /** New user creation form to be submitted to backend */
  const [creationForm, setForm] = useState({
    email: "",
    password: "",
  });

  /**
   * Creates a function that Updates the creationForm for the key:value pair specified in param.
   * 
   * @param {Object} value - { key : value } of creationForm
   * @returns {Function} that handles the updating of creationForm
   */
  const updateForm = (value) => {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  };

  /**
   * Handles the email and password creation.
   * 
   * @function handleEmailPwCreation
   * @async
   * @return {void}
   */
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

  /**
   * Sends email verification emails to newly created users.
   * 
   * @function verifyEmail
   * @async
   * @return {void}
   */
  async function verifyEmail() {
    await sendEmailVerification(newUserCreated)
      .then(console.log("Email verification sent"))
      .catch((error) => console.log(error));
  }

    // Runs when a new user is registered
    useEffect(() => {
      if (newUserCreated) {
        verifyEmail();
      } 
    }, [newUserCreated]);

  /**
   * Runs onSubmission of creationForm.
   * Creates user in firebase and MongoDB.
   * 
   * @param {Event} event 
   * @return {void}
   */
  async function handleSubmit(event) {
      event.preventDefault();
      await handleEmailPwCreation();
      const newUser = creationForm;
      await CreateUserMongo();
      // resets the form once submitted
      setForm({ email: "", password: "" });
      event.target.reset();
  }

  return (
    <>
      <div className="register">
        <form
          className="register-style-form"
          onSubmit={handleSubmit}
          style={{
            width: "20rem",
            border: "1px solid grey",
            // paddingLeft: "10vh",
            paddingBlock: "3%",
            paddingLeft: "20px",
            paddingRight: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px lightgrey",
          }}
        >
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
          <button
            type="submit"
            className="btn btn-light"
            style={{
              marginTop: "10px",
              border: "0.5px solid",
              // filter: "drop-shadow(0px 10px 10px lightgrey)",
              borderRadius: "10px",
            }}
          >
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

import { useState, React, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import firebaseAuth from "../firebase.config";
import CreateUserMongo from "./helperFunctions/CreateUserMongo.jsx";

  /**
   * Handles the email and password creation.
   * 
   * @function handleEmailPwCreation
   * @async
   * @param {Object} auth firebaseAuth
   * @param {Object} registrationForm Form Object
   * @param {string} registrationForm.email email of User
   * @param {string} registrationForm.password password of User 
   * @return {Object} User created
   */
  export async function handleEmailPwCreation(auth, registrationForm) {
    let user;
    await createUserWithEmailAndPassword(auth, registrationForm.email, registrationForm.password)
      .then(async (userCredential) => {
        user = userCredential.user;
        // updateUser(user);
        console.log("registered with email and password");
      })
      .catch((error) => {
        const errorMessage = error.message;
        throw error;
      });
      return user;
  }

/**
 * Component that handles the registration of a new user via email and password.
 * 
 * @param {Object} props Property brought forward
 * @param { function } props.handleSubmitMock Mock version of handleSubmit - used for jest testing
 * @returns {React.ReactElement} - The registration form page
 */
export default function Register(props) {

  const [newUserCreated, updateUser] = useState(null);
  // track errorMessage
  const [error, setError] = useState(null);

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
      updateUser(
        await handleEmailPwCreation(firebaseAuth, creationForm)
          .catch(error => {
            setError(error.message);
            return;
          })
      );
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
            width: "40vw",
            height: "70vh",
            border: "1px solid grey",
            // paddingLeft: "10vh",
            // paddingBlock: "3%",
            padding: "5rem",
            borderRadius: "10px",
            boxShadow: "0 0 10px lightgrey",
          }}
          data-testid= "register-form"
        >
          <h1 style= {{"text-align": "center"}}>Create Your Free Account</h1>
          <label htmlFor="email" data-testid= "label-email">Email: </label>
          <input
            type="text"
            name="password"
            id="email"
            value={creationForm.email}
            placeholder="Your email"
            onChange={(event) => updateForm({ email: event.target.value })}
            data-testid='input-email'
            required
          />
          <label htmlFor="password" data-testid= "label-password" style ={{"margin-top": "2vh"}}>Password: </label>
          <input
            type="text"
            name="password"
            id="password"
            value={creationForm.password}
            placeholder="Your password"
            onChange={(event) => updateForm({ password: event.target.value })}
            data-testid= "input-password"
            required
          />
          {error ? <h5 className= "error-alert" style ={{'margin-top':"1vh"}}>{error}</h5> : <h3 style= {{display: "none"}}></h3>}
          <button
            type="submit"
            className="btn btn-light"
            style={{
              marginTop: "10px",
              border: "0.5px solid",
              // filter: "drop-shadow(0px 10px 10px lightgrey)",
              borderRadius: "10px",
              "text-align": "center",
              width: "50%",
              margin: "auto",
              "margin-top": "4vh",
              padding: "1rem",
              "font-weight": "bold",
            }}
            data-testid= 'submit-button'
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

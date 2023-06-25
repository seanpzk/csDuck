import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../stylesheets/styles.css";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import firebaseAuth from "../firebase.config";
import googleLogo from "../assets/google.png";
import facebookLogo from "../assets/facebook.png";
import CreateUserMongo from "./helperFunctions/CreateUserMongo.jsx";

/**
 * User login using email and password
 * 
 * @param {Object} auth - firebaseAuth object
 * @param {Object} loginDetails - user that is logging in
 * @param {string} loginDetails.email - email of user logging in
 * @param {string} loginDetails.password - password of user logging in
 */
export async function handleEmailPwLogin(auth, loginDetails) {
  await signInWithEmailAndPassword(
    auth,
    loginDetails.email,
    loginDetails.password
  )
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("logged in with email and password");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw error;
    });
}

/**
 * Componenet that enables Login using three methods.
 * 1) Gooogle Login
 * 2) Facebook Login
 * 3) Email and password Login
 * 
 * @param {Object} props 
 * @param {boolean} props.auth Tracks if user is authenticated
 * @param {function} props.setAuth set State of auth
 * @returns {React.ReactElement} - The login form/page
 * @description need to use SSL/TLS to securely send data from client to server
 */
export default function Login(props) {

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  // stores form info
  const [loginForm, setForm] = useState({
    email: "",
    password: "",
  });
  // error Message
  const [error, setError] = useState(null);

  /**
   * Handles login using Google.
   * Automatically create, login and verifies email.
   * Creates user in MongoDB
   * 
   * @return {void}
   */
  async function loginWithGoogle() {
    const response = await signInWithPopup(firebaseAuth, googleProvider)
      .then(async (result) => {
        await CreateUserMongo();
        // const token =
        //   GoogleAuthProvider.credentialFromResult(result).accessToken;
        // const user = result.user;
        // props.setAuth(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * Handles login using Facebook.
   * Automatically create, login.
   * Sends email verification to user!
   * Creates user in MongoDB
   * 
   * @return {void}
   */
  async function loginWithFacebook() {
    const response = await signInWithPopup(firebaseAuth, facebookProvider)
      .then(async (result) => {
        await CreateUserMongo();
        await sendEmailVerification(result.user)
          .then(console.log("Email verification sent"))
          .catch((error) => {
            console.log(error)
          });
        // const token =
        //   FacebookAuthProvider.credentialFromResult(result).accessToken;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // const credential = FacebookAuthProvider.credentialFromError(error);
        console.log(errorMessage);
        throw error;
      });
  };

  const updateForm = (value) => {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  };

  /**
   * Submits form to backend. Resets when done.
   * 
   * @param {Event} event
   */
  async function handleSubmit(event) {
    event.preventDefault();
    await handleEmailPwLogin(firebaseAuth, loginForm)
      .catch(error => {
        if (error.message === "Firebase: Error (auth/invalid-email).") {
          setError("Invalid Email");
        } else if (error.message === "Firebase: Error (auth/user-not-found).") {
          setError("Email not found");
        } else if (error.message === "Firebase: Error (auth/wrong-password).") {
          setError("Wrong password");
        }
      });
    setForm({ email: "", password: "" });
    // resets the form once submitted
    event.target.reset();
  }

  return (
    <div className="login">
      {!props.auth ? (
        <>
          <div
            className="other-login-container"
            style={{
              width: "30rem",
              border: "1px solid grey",
              // paddingLeft: "10vh",
              paddingBlock: "3%",
              borderRadius: "10px",
              boxShadow: "0 0 10px lightgrey",
            }}
          >
            <form className="login-style-form" onSubmit={handleSubmit} data-testid='login-form'>
              <h1 className='login-header'>Login</h1>
              <div>
                Don't have an account? 
                <NavLink style={{ color: "blue", margin: 5, 'text-decoration': "none" }} to="/register">
                Register here.
                </NavLink>
              </div>
              <label htmlFor="email" data-testid='email-label'>Email:</label>
              <input
                type="text"
                name="email"
                id="email"
                value={loginForm.email}
                placeholder="Your email"
                onChange={(event) => updateForm({ email: event.target.value })}
                data-testid='email-input'
                required
              />
              <label htmlFor="password" data-testid="password-label">Password:</label>
              <input
                type="text"
                name="password"
                id="password"
                value={loginForm.password}
                placeholder="Your password"
                onChange={(event) =>
                  updateForm({ password: event.target.value })
                }
                data-testid= "password-input"
                required
              />
            {error ? <h5 className= "error-alert" style ={{'margin-top':"1vh"}}>{error}</h5> : <h3 style= {{display: "none"}}></h3>}
              <button
              data-testid = "login-button"
                type="submit"
                className="btn btn-light"
                style={{
                  border: "0.5px solid",
                  // filter: "drop-shadow(0px 10px 10px lightgrey)",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              >
                Log in
              </button>
              <br />
            </form>
            <hr />
            <h2>Log in using other alternatives</h2>
            <div
              className="other-login-container"
              style={{
                width: "20rem",
                margin: 0,
                // border: "1px solid grey",
                padding: 0,
                borderRadius: "10px",
              }}
            >
              <button onClick={loginWithGoogle} data-testid = "google-login">
                <img src={googleLogo} data-testid ="googleImg"/>
              </button>
              <button onClick={loginWithFacebook} data-testid = "facebook-login">
                <img src={facebookLogo} data-testid ="facebookImg"/>
              </button>
              <hr />
            </div>
            <div>
              Forgot your password? 
              <NavLink style={{ color: "red", margin: 5, "text-decoration": "none" }} to="/reset">
                Reset here
              </NavLink>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1>You are logged in</h1>
          <NavLink style={{ color: "black" }} to="/">
            Go to task list
          </NavLink>
        </>
      )}
    </div>
  );
}

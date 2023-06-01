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

// I think we need to use SSL/TLS to securely send data from client to server
export default function Login(props) {

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  // stores form info
  const [loginForm, setForm] = useState({
    email: "",
    password: "",
  });

  // Handles login using Google. Automatically verifies email
  async function loginWithGoogle() {
    const response = await signInWithPopup(firebaseAuth, googleProvider)
      .then(async (result) => {
        await CreateUserMongo();
        const token =
          GoogleAuthProvider.credentialFromResult(result).accessToken;
        const user = result.user;
        // props.setAuth(true);
        console.log(token);
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handles login using Facebook. Does not automatically verify email
  async function loginWithFacebook() {
    const response = await signInWithPopup(firebaseAuth, facebookProvider)
      .then(async (result) => {
        await CreateUserMongo();
        await sendEmailVerification(result.user)
          .then(console.log("Email verification sent"))
          .catch((error) => console.log(error));
        const token =
          FacebookAuthProvider.credentialFromResult(result).accessToken;
        // const user = result.user;
        // props.setAuth(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.log(errorMessage);
      });
  };

  const updateForm = (value) => {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  };

  // Handles login using email and password
  const handleEmailPwLogin = () =>
    signInWithEmailAndPassword(
      firebaseAuth,
      loginForm.email,
      loginForm.password
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        console.log("logged in with email and password");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });

  // sends login request to the server
  async function handleSubmit(event) {
    event.preventDefault();
    handleEmailPwLogin();
    const form = loginForm;
    /*
    const res = await fetch(`${backendURL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          // props.setAuth(true);
          return response.json();
        } else {
          throw new Error("An error occured during login, Please try again!");
        }
      })
      .catch((error) => {
        window.alert(error);
        // props.setAuth(false);
        return;
      });
      */
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
            <form className="login-style-form" onSubmit={handleSubmit}>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                name="email"
                id="email"
                value={loginForm.email}
                placeholder="Your email"
                onChange={(event) => updateForm({ email: event.target.value })}
              />
              <label htmlFor="password">Password:</label>
              <input
                type="text"
                name="password"
                id="password"
                value={loginForm.password}
                placeholder="Your password"
                onChange={(event) =>
                  updateForm({ password: event.target.value })
                }
              />

              <button
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
              <hr />

              <h2>Log in using other alternatives</h2>
              <button onClick={loginWithGoogle}>
                <img src={googleLogo} />
              </button>
              <button onClick={loginWithFacebook}>
                <img src={facebookLogo} />
              </button>
              <hr />
            </div>

            <NavLink style={{ color: "blue", margin: 5 }} to="/register">
              Don't have an account? Register here.
            </NavLink>

            <NavLink style={{ color: "red", margin: 5 }} to="/reset">
              Forgot your password? Reset here
            </NavLink>
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

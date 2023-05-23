import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import "../styles.css";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import firebaseAuth from "../firebase.config";
import googleLogo from "../assets/google.png";
import facebookLogo from "../assets/facebook.png";

// I think we need to use SSL/TLS to securely send data from client to server
export default function Login(props) {

    const navigate = useNavigate();

    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();

    // stores form info
    const [loginForm, setForm] = useState({
        username: "", 
        password: "",
    });

    // Handles login using Google 
    const loginWithGoogle = async () => {
      const response = await signInWithPopup(firebaseAuth, googleProvider)
        .then(result => {
          const token = GoogleAuthProvider.credentialFromResult(result).accessToken;
          const user = result.user;
          props.setAuth(true);
          console.log(token);
          console.log(user);
        }).catch(error => {
          console.log(error);
        });
    };

    // Handles login using Facebook <--> Not usable for now!!
    const loginWithFacebook = async () => {
      const response = await signInWithPopup(firebaseAuth, facebookProvider)
        .then(result => {
          const token = FacebookAuthProvider.credentialFromResult(result).accessToken;
          // const user = result.user;
          props.setAuth(true);
          console.log(token);
          console.log(user);
        }).catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const credential = FacebookAuthProvider.credentialFromError(error);
          console.log(errorMessage);
        });
    };

    // Handles login using email and password
    const handleEmailPwLogin = () => signInWithEmailAndPassword(firebaseAuth, loginForm.username, loginForm.password)
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
        const res = await fetch("http://localhost:5050/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })
        .then((response) => {
          if (response.ok) {
            props.setAuth(true);
            return response.json();
          } else {
            throw new Error("An error occured during login, Please try again!");
          }
        })
        .catch((error) => {
            window.alert(error);
            props.setAuth(false);
            return;
        })
        setForm({ username: "", password: "" });
        // resets the form once submitted
        event.target.reset();
        // navigate("/");
    }

    const updateForm = (value) => {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

return (
    <div className="login">
      {
        !props.auth 
        ? <>
          <form className="login-style-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              id="username"
              value={loginForm.username}
              placeholder="Your username"
              onChange={(event) => updateForm({ username: event.target.value })}
            />
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              name="password"
              id="password"
              value={loginForm.password}
              placeholder="Your password"
              onChange={(event) => updateForm({ password: event.target.value })}
            />
            <button type="submit" className="btn btn-light">Log in</button>
            <br/>
          </form>
          <button onClick = {loginWithGoogle}><img src = {googleLogo} /></button>
          <button onClick = {loginWithFacebook}><img src = {facebookLogo} /></button>
          <NavLink style={{ color: "white" }} to="/register">
            Don't have an account? Register here.
          </NavLink>
        </>
       : <h1>You are logged in</h1>
    }
    </div>
  );
}


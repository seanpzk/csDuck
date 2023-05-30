import { useState, React, useEffect } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import firebaseAuth from "../firebase.config";

// I think we need to use SSL/TLS to securely send data from client to server

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

  /*
  const handleEmailPwCreation = () =>
    createUserWithEmailAndPassword(
      firebaseAuth,
      creationForm.email,
      creationForm.password
    )
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        console.log("registered with email and password");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
*/

  async function handleEmailPwCreation() {
    await createUserWithEmailAndPassword(
      firebaseAuth,
      creationForm.email,
      creationForm.password
    )
      .then(async (userCredential) => {
        const user = userCredential.user;
        updateUser(user);
        console.log("registered with email and password");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  async function verifyEmail() {
    await sendEmailVerification(newUserCreated)
      .then(console.log("Email verification sent"))
      .catch((error) => console.log(error));
  }

  function checkVerified() {
    if (newUserCreated) {
      newUserCreated.reload();
      if (newUserCreated.emailVerified) {
        console.log("Email verified");
        navigate("/reginfo");
      }
    }
  }

  // Runs when a new user is registered
  useEffect(() => {
    if (newUserCreated) {
      verifyEmail();
    } else {
      console.log("Please verify your email");
    }
  }, [newUserCreated]);

  // Checks if a user has verified email
  useEffect(() => {
    const interval = setInterval(checkVerified, 1000);
    return () => clearInterval(interval);
  }, [newUserCreated]);

  async function handleSubmit(event) {
    event.preventDefault();
    handleEmailPwCreation();
    const newUser = creationForm;

    // await fetch("http://localhost:5050/register", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(newUser),
    // })
    // .catch((error) => {
    //     window.alert(error);
    //     return;
    // })
    setForm({ email: "", password: "" });
    // resets the form once submitted
    event.target.reset();
    // ADD RESPONSE FROM SERVER -> ENSURES USER IS CREATED IN DB!!!!!!!!!!!!!!
  }
  /*
  async function handleSubmit(event) {
    event.preventDefault();
    handleEmailPwCreation();
    const newUser = creationForm;

    await fetch("http://localhost:5050/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }).catch((error) => {
      window.alert(error);
      return;
    });
    console.log("user creation request sent");
    setForm({ email: "", password: "" });
    // resets the form once submitted
    event.target.reset();
    // ADD RESPONSE FROM SERVER -> ENSURES USER IS CREATED IN DB!!!!!!!!!!!!!!
    navigate("/login");
  }
  */
  return (
    <>
      {/* <div>Please verify email before proceeding</div> */}
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

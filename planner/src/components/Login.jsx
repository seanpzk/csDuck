import React, { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import "../styles.css";

export default function Login() {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setLoginForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function handleSubmit(e) {
    e.preventDefault();

    // When a post request is sent to the create url, we'll add a new record to the database.
    const newForm = loginForm;

    const res = await fetch("http://localhost:5050/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newForm),
    })
      .then((res) => res.json())
      .catch((error) => {
        window.alert(error);
        return;
      });

    console.log(res);

    setLoginForm({ username: "", password: "" });
    e.target.reset();
    // navigate("/");
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div className="login">
      <form className="login-style-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={loginForm.username}
          placeholder="Your username"
          onChange={(e) => updateForm({ username: e.target.value })}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          name="password"
          id="password"
          value={loginForm.password}
          placeholder="Your password"
          onChange={(e) => updateForm({ password: e.target.value })}
        />
        <button type="submit" className="btn btn-light">
          Log in
        </button>
      </form>
      <NavLink style={{ color: "white" }} to="/register">
        Don't have an account? Register here.
      </NavLink>
    </div>
  );
}

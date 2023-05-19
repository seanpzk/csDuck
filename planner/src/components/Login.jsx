import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles.css";

export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // prevents the page from reloading that will cause loss of state
    console.log(email);
  };

  return (
    <>
      <div className="login">
        <form className="login-style-form" onSubmit={handleSubmit}>
          <label htmlFor="email">email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="youremail@email.com"
            id="email"
            name="email"
          />
          <label htmlFor="password">password</label>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="*******"
            id="password"
            name="password"
          />
          <button type="submit">Log in</button>
        </form>
        <NavLink style={{ color: "white" }} to="/register">
          Don't have an account? Register here.
        </NavLink>
      </div>
    </>
  );
};

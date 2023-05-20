import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export const Register = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // prevents the page from reloading that will cause loss of state
    console.log(email);
  };
  return (
    <>
      <div className="register">
        <form className="register-style-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            id="name"
            placeholder="Full Name"
          />
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
          <button type="submit">Register</button>
        </form>
        <NavLink style={{ color: "white" }} to="/login">
          Already have an account? Login here.
        </NavLink>
      </div>
    </>
  );
};

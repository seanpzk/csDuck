import { useState, React } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";

// I think we need to use SSL/TLS to securely send data from client to server

export default function Register() {
  const navigate = useNavigate();

  const [creationForm, setForm] = useState({
    username: "",
    password: "",
  });

  // value passed here is an object
  const updateForm = (value) => {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
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
    setForm({ username: "", password: "" });
    // resets the form once submitted
    e.target.reset();
    // ADD RESPONSE FROM SERVER -> ENSURES USER IS CREATED IN DB!!!!!!!!!!!!!!
    // For some reason, redirect doesn't work here
    navigate("/");
  }

  return (
    <>
      <div className="register">
        <form className="register-style-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="password"
            id="username"
            value={creationForm.username}
            placeholder="Your username"
            onChange={(e) => updateForm({ username: e.target.value })}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="text"
            name="password"
            id="password"
            value={creationForm.password}
            placeholder="Your password"
            onChange={(e) => updateForm({ password: e.target.value })}
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

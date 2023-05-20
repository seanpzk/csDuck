import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import "../styles.css";

// I think we need to use SSL/TLS to securely send data from client to server
export default function Login() {

    const navigate = useNavigate();

    // stores form info
    const [loginForm, setForm] = useState({
        username: "", 
        password: "",
    });

    // sends login request to the server
    async function handleSubmit(event) {
        event.preventDefault();

        const form = loginForm;
        const res = await fetch("http://localhost:5050/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })
        .then((response) => response.json())
        .catch((error) => {
            window.alert(error);
            return;
        })
        console.log(res);

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


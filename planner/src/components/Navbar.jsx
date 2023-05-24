import React, { useEffect } from "react";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

import firebaseAuth from "../firebase.config";

// Here, we display our Navbar
export default function Navbar(props) {
  
  useEffect(() => firebaseAuth.onAuthStateChanged(
    () => props.setAuth(firebaseAuth.currentUser != null)));

  async function handleLogout() {
    await firebaseAuth.signOut();
  }

  return (
    <div>
      <nav
        className="navbar navbar-expand"
        style={{ backgroundColor: "#d0cfff" }}
      >
        <NavLink className="navbar-brand" to="/">
          <img
            style={{ width: 25 + "%" }}
            src="https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/webimage-8A27671A-8A53-45DC-89D7BF8537F15A0D.png"
          ></img>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item "></li>
          </ul>
        </div>
        <form className="container-fluid justify-content-start d-flex flex-row-reverse">
            <NavLink className="btn btn-sm btn-outline-secondary" to="/register">
              Register
            </NavLink>
          {
            !props.auth
              ? <NavLink className="btn btn-outline-success me-2" to="/login">
                    Login
                </NavLink>
              : <button className="btn btn-outline-success me-2" type = "button" onClick= {handleLogout}>Logout</button>
          }
        </form>
      </nav>
    </div>
  );
}

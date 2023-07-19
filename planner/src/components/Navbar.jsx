import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

import firebaseAuth from "../firebase.config";
import { UserPresenceLogout } from "./helperFunctions/UserPresence";
import iconDuck from "../assets/iconicDuck.png";
import { backendURL } from "./helperFunctions/serverUrl";
/**
 * Navbar component
 *
 * @param {Object} props
 * @param {Boolean} props.sidebarActive
 * @param {Function} props.setSidebar
 * @returns jsx component navbar
 */
export default function Navbar(props) {
  const navigate = useNavigate();
  useEffect(() =>
    firebaseAuth.onAuthStateChanged(() =>
      props.setAuth(firebaseAuth.currentUser != null)
    )
  );

  async function handleLogout() {
    UserPresenceLogout(firebaseAuth.currentUser);
    await firebaseAuth.signOut();
    navigate("/login");
  }

  return (
    <div>
      <nav
        className="navbar navbar-expand "
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0px 5px 10px lightgrey",
        }}
      >
        <NavLink className="navbar navbar-brand" to="/">
          <img
            style={{
              height: "5rem",
              borderRadius: "10px",
              marginLeft: "30%",
              boxShadow: "0px 5px 10px lightgrey",
            }}
            // src="https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/webimage-8A27671A-8A53-45DC-89D7BF8537F15A0D.png"
            src={iconDuck}
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
          {!props.auth && (
            <NavLink
              className="btn btn-sm btn-outline-secondary"
              to="/register"
            >
              Register
            </NavLink>
          )}
          {!props.auth ? (
            <NavLink
              className="btn btn-outline-success me-2"
              to="/login"
              name="login-btn"
            >
              Login
            </NavLink>
          ) : (
            <>
              <button
                className="btn btn-outline-success me-2"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
              <NavLink className="btn btn-outline-success me-2" to="/mytasks">
                My Tasks
              </NavLink>
              <a
                className="btn btn-outline-success me-2"
                href={`${backendURL}/googlecalendar`}
                target="_blank"
                role="button"
              >
                Connect to google calendar 📅
              </a>
              <NavLink
                className="btn btn-outline-success me-2"
                to="/settings/profile"
              >
                Settings
              </NavLink>
            </>
          )}
        </form>
      </nav>
    </div>
  );
}

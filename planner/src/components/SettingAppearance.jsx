import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import firebaseAuth from "../firebase.config";
import { getAuth } from "firebase/auth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { backendURL } from "./helperFunctions/serverUrl";
import useLocalStorage from "./useLocalStorage";
import ThemeSwitcher from "./ThemeSwitcher";

export default function SettingAppearance() {
  const [allowCustomisation, setAllowCustomisation] = useLocalStorage(
    "react-todo.customisation",
    false
  );

  async function customisationTrue() {
    console.log("set customisation to true req");
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    const update = {
      allowCustomisation: true,
      UID: firebaseAuth.currentUser.uid,
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5050/tasklist`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
    });
  }

  async function customisationFalse() {
    console.log("set customisation to false req");
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    const update = {
      allowCustomisation: false,
      UID: firebaseAuth.currentUser.uid,
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5050/tasklist`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
    });
  }

  async function toggleCustomisation() {
    console.log("toggleCustomisation ran");
    allowCustomisation ? customisationFalse() : customisationTrue();
    setAllowCustomisation(!allowCustomisation);
  }

  // The UI to display the information of user with functionalities.
  return (
    <>
      <div className="setting-header">
        <Row>
          <Col style={{ fontSize: "5vh", fontWeight: "bold" }}>⚙️ Settings</Col>
          <Col className="setting-header-subgroups">
            <Link className="setting-header-text" to="/settings/profile">
              Profile
            </Link>
          </Col>
          <Col className="setting-header-subgroups">
            <Link className="setting-header-text " to="/settings/security">
              Security
            </Link>
          </Col>
          <Col className="setting-header-subgroups">
            <Link
              className="setting-header-text "
              style={{ backgroundColor: "lightgrey", color: "black" }}
              to="/settings/security"
            >
              Appearance
            </Link>
          </Col>
        </Row>
      </div>

      <div className="setting-body">
        <div
          className="form-check form-switch"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "start",
          }}
        >
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
            checked={allowCustomisation}
            onClick={toggleCustomisation}
          />
          <label className="form-check-label" for="flexSwitchCheckDefault">
            Allow customisation on My Tasks page
          </label>
          {allowCustomisation ? <ThemeSwitcher></ThemeSwitcher> : <></>}
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import firebaseAuth from "../firebase.config";
import { useParams } from "react-router-dom";
import { backendURL } from "./helperFunctions/serverUrl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function SettingProfile() {
  const [info, setInfo] = useState([]);
  const navigate = useNavigate();

  /**
   * Get user's information and store in state info.
   */
  useEffect(() => {
    async function getInfo() {
      const idToken = await firebaseAuth.currentUser?.getIdToken();
      const UID = firebaseAuth.currentUser.uid;
      // creates a default GET request -> included UID
      const response = await fetch(`${backendURL}/setting`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + idToken,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const info = await response.json();
      setInfo(info[0]);
      console.log("just finished setting info");
      console.log(info);
    }
    getInfo();

    return;
  }, []);

  /**
   * Updates the state info
   * @param {*} value - Information to be updated in state info.
   */
  function updateInfo(value) {
    return setInfo((prev) => {
      return { ...prev, ...value };
    });
  }

  // This will update user data in database.
  async function onSubmit(e) {
    e.preventDefault();
    const editedInfo = {
      email: info.email,
      username: info.username,
      uid: info.firebaseUID,
      bio: info.bio,
    };
    const idToken = await firebaseAuth.currentUser?.getIdToken();

    // This will send a post request to update the data in the database.

    await fetch(`${backendURL}/setting`, {
      method: "PATCH",
      body: JSON.stringify(editedInfo),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
    });

    navigate("/settings/profile");
  }

  return (
    <>
      <div className="setting-header">
        <Row>
          <Col style={{ fontSize: "5vh", fontWeight: "bold" }}>⚙️ Settings</Col>
          <Col className="setting-header-subgroups">
            <Link
              className="setting-header-text"
              style={{ backgroundColor: "lightgrey", color: "black" }}
              to="/settings/profile"
            >
              Profile
            </Link>
          </Col>
          <Col className="setting-header-subgroups">
            <Link className="setting-header-text " to="/settings/security">
              Security
            </Link>
          </Col>
          <Col className="setting-header-subgroups">
            <div className="setting-header-text">Appearance</div>
          </Col>
        </Row>
      </div>
      <div className="setting-body">
        <Container>
          <form onSubmit={onSubmit}>
            <Row className="setting-body-row">
              <Col xs lg="2">
                <label htmlFor="username"> Username:</label>
              </Col>

              <Col xs lg="3">
                <input
                  type="text"
                  id="username"
                  value={info.username}
                  placeholder="Your username here"
                  onChange={(e) => updateInfo({ username: e.target.value })}
                />
              </Col>
              <Col xs lg="2">
                <input
                  type="submit"
                  style={{ width: "100%", color: "black", border: "none" }}
                  value="Update"
                ></input>
              </Col>
            </Row>
            <Row className="setting-body-row flex-nowrap">
              <Col xs lg="2">
                Email:
              </Col>
              <Col xs lg="3">
                <input
                  disabled
                  type="text"
                  name="email"
                  id="email"
                  placeholder={info.email}
                />
              </Col>
              <Col xs lg="2">
                <input
                  type="submit"
                  style={{
                    width: "100%",
                    color: "black",
                    backgroundColor: "pink",
                    border: "none",
                  }}
                  value="Verify email"
                ></input>
              </Col>
            </Row>

            <Row className="setting-body-row">
              <Col lg="2">Bio:</Col>
              <Col>
                <input
                  type="text"
                  id="bio"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "start",
                    height: "150%",
                  }}
                  placeholder="Your bio here"
                  value={info.bio}
                  onChange={(e) => updateInfo({ bio: e.target.value })}
                />
                <Col className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <input
                    type="submit"
                    style={{ width: "10%", color: "black", border: "none" }}
                    value="Save"
                  ></input>
                </Col>
              </Col>
            </Row>
          </form>
        </Container>
      </div>
    </>
  );
}

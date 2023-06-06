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

  useEffect(() => {
    async function getInfo() {
      const idToken = await firebaseAuth.currentUser?.getIdToken();
      const UID = firebaseAuth.currentUser.uid;
      // creates a default GET request -> included UID
      const response = await fetch(`${backendURL}/setting?UID=${UID}`, {
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
    }
    getInfo();
    return;
  }, []);

  function updateInfo(value) {
    return setInfo((prev) => {
      return { ...prev, ...value };
    });
  }

  // This will update username.
  async function onSubmit(e) {
    e.preventDefault();
    const editedInfo = {
      email: info.email,
      username: info.username,
      uid: info.firebaseUID,
    };
    const idToken = await firebaseAuth.currentUser?.getIdToken();

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5050/setting`, {
      method: "PATCH",
      body: JSON.stringify(editedInfo),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
    });

    navigate("/settings/profile");
  }

  const UserInfo = () => (
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
            {" "}
            <div className="form-group">
              <Row className="setting-body-row">
                <Col xs lg="2">
                  <label htmlFor="name"> Username:</label>
                </Col>

                <Col xs lg="3">
                  <div className="form-group">
                    <input
                      type="text"
                      // className="form-control"
                      id="name"
                      // placeholder={props.userInfo.username}
                      value={info.username}
                      onChange={(e) => updateInfo({ username: e.target.value })}
                    />
                  </div>
                </Col>
                <Col
                  xs
                  lg="2"
                  className="btn btn-outline"
                  style={
                    {
                      // backgroundColor: "lightgreen",
                    }
                  }
                >
                  <input type="submit" value="Update"></input>
                </Col>
              </Row>
            </div>
          </form>
          <Row className="setting-body-row flex-nowrap">
            <Col xs lg="2">
              Email:
            </Col>
            <Col xs lg="3">
              <input
                type="text"
                name="name"
                id="name"
                // value={loginForm.email}
                placeholder={info.email}
              />
            </Col>
            <Col
              xs
              lg="2"
              className="btn btn-outline"
              style={{ backgroundColor: "pink" }}
            >
              Verify email
            </Col>
          </Row>

          <Row className="setting-body-row">
            <Col lg="2">Bio:</Col>
            <Col>
              <input
                type="text"
                name="name"
                id="name"
                // value={loginForm.email}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "start",
                  height: "250%",
                }}
                placeholder="Your bio here"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );

  return <UserInfo />;
}

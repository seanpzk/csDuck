import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import firebaseAuth from "../firebase.config";
import { getAuth } from "firebase/auth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { backendURL } from "./helperFunctions/serverUrl";

export default function SettingSecurity() {
  const [info, setInfo] = useState([]);
  const [user, setUser] = useState(null);

  /**
   * This will display the necessary user info on the different
   */
  useEffect(() => {
    const getUserInfo = () => {
      const auth = getAuth();
      const user = auth.currentUser;
      setInfo({
        email: user.email,
        name: "temp placeholder",
        phoneNumber: "9123 4567",
      });
    };
    getUserInfo();
    return;
  }, []);

  /**
   * Check if a user is registered
   * @param {*} User - User object obtained from firebase
   * @returns Boolean that states if user is registered
   */
  async function checkRegistered(User) {
    const UID = User.uid;
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    const response = await fetch(`${backendURL}/login?UID=${UID}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + idToken,
        "Content-Type": "application/json",
      },
    }).catch((error) => console.log(error));
    const resObj = await response.json();
    if (resObj.message === "not registered") {
      return false;
    }
    return true;
  }

  /**
   * Check if current user is verified
   * @returns Boolean that checks if current user is verified
   */
  async function checkVerified() {
    setUser(firebaseAuth.currentUser);
    const registered = await checkRegistered(user);
    return registered;
  }

  // The UI to display the information of user with functionalities.
  const UserInfo = (props) => (
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
            <Link
              className="setting-header-text "
              style={{ backgroundColor: "lightgrey", color: "black" }}
              to="/settings/security"
            >
              Security
            </Link>
          </Col>

          <Col className="setting-header-subgroups">
            <Link className="setting-header-text " to="/settings/appearance">
              Appearance
            </Link>
          </Col>
        </Row>
      </div>
      <div className="setting-body">
        <Container>
          <Row className="setting-body-row">
            <Col xs lg="2">
              Verified email:
            </Col>
            <Col xs lg="3">
              <input
                disabled
                type="text"
                name="email"
                id="email"
                style={{ backgroundColor: "white" }}
                // value={loginForm.email}
                placeholder={props.userInfo.email}
              />
            </Col>
            <Col
              xs
              lg="2"
              className="btn btn-outline"
              style={
                checkVerified()
                  ? { backgroundColor: "lightgreen" }
                  : { backgroundColor: "lightpink" }
              }
            >
              {checkVerified() ? "Email Verified" : "Send verification email"}
            </Col>
          </Row>
          <Row className="setting-body-row flex-nowrap">
            <Col xs lg="2">
              Phone Number:
            </Col>
            <Col xs lg="3">
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                // value={loginForm.email}
                placeholder={props.userInfo.phoneNumber}
              />
            </Col>
            <Col
              xs
              lg="2"
              className="btn btn-outline"
              style={{ backgroundColor: "pink" }}
            >
              Send OTP code
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );

  function userInfoList() {
    return <UserInfo userInfo={info} />;
  }

  return userInfoList();
}

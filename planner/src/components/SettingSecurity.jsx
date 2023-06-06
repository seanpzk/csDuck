import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import firebaseAuth from "../firebase.config";
import { getAuth } from "firebase/auth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function SettingSecurity() {
  const [info, setInfo] = useState([]);
  const navigate = useNavigate();
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
            <div className="setting-header-text">Appearance</div>
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
                type="text"
                name="email"
                id="email"
                // value={loginForm.email}
                placeholder={props.userInfo.email}
              />
            </Col>
            <Col
              xs
              lg="2"
              className="btn btn-outline"
              style={{
                backgroundColor: "lightgreen",
              }}
            >
              Send verification email
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

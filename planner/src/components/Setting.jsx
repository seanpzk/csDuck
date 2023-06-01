import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import firebaseAuth from "../firebase.config";
import { getAuth } from "firebase/auth";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Setting() {
  const [info, setInfo] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getUserInfo = () => {
      const auth = getAuth();
      const user = auth.currentUser;
      setInfo({ email: user.email, name: "temp placeholder" });
    };
    getUserInfo();
    return;
  }, []);

  const UserInfo = (props) => (
    <>
      <div className="setting-header">
        <Container>
          <Row>
            <Col style={{ fontSize: "5vh", fontWeight: "bold" }}>
              ⚙️ Settings
            </Col>
            <Col className="setting-header-subgroups">Profile</Col>
            <Col className="setting-header-subgroups">Security</Col>
            <Col className="setting-header-subgroups">Appearance</Col>
          </Row>
        </Container>
      </div>
      <div className="setting-body">
        <Container>
          <Row className="setting-body-row">
            <Col xs lg="2">
              Username:
            </Col>
            <Col xs lg="3">
              <input
                type="text"
                name="name"
                id="name"
                // value={loginForm.email}
                placeholder={props.userInfo.name}
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
              Update
            </Col>
          </Row>
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
                placeholder={props.userInfo.email}
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

  function userInfoList() {
    console.log(info);

    return <UserInfo userInfo={info} />;
  }

  return userInfoList();
}

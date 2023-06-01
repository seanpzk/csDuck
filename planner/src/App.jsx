import React, { useState, useEffect } from "react";

// We use Route in order to define the different routes of our application
import { Link, Outlet, Route, Routes, useNavigate, useLocation } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/Navbar";
import Edit from "./components/Edit";
import Create from "./components/Create";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Register from "./components/Register";
import Reset from "./components/Reset";
import NotFound from "./components/NotFound";
import firebaseAuth from "./firebase.config";
import RegInfo from "./components/RegInfo";
import TaskList from "./components/TaskList";

import Setting from "./components/Setting";


import VerifyEmail from "./components/VerifyEmail";
import { backendURL } from "./components/helperFunctions/serverUrl";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  async function checkRegistered(User) {
    const UID = User.uid;
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    const response = await fetch(`${backendURL}/login?UID=${UID}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + idToken,
        "Content-Type": "application/json",
      },
    }).catch(error => console.log(error));
    const resObj = await response.json();
    if (resObj.message === "not registered") {
      return false;
    }
    return true;
  }

  async function checkVerified() {
    setUser(firebaseAuth.currentUser);
    // not the best way... This looks for any path with /reginfo
    if (user && !location.pathname.includes("/reginfo")) {
      user.reload();
      if (user.emailVerified) {
        const registered = await checkRegistered(user);
        if (!registered) {
          console.log("Email verified and not registered");
          navigate("/reginfo");
        }
      } else {
        navigate("/verifyEmail");
      }

    }
  }

  // Forces user to input their registration details if they have yet to do so
  useEffect(() => {
    const interval = setInterval(checkVerified, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const [auth, setAuth] = useState(false);

  return (
    <div className="app">
      <Navbar auth={auth} setAuth={setAuth} />
      <Routes>
        <Route exact path="/" element={<Homepage auth={auth} />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route
          path="/login"
          element={<Login auth={auth} setAuth={setAuth} />}
        />
        <Route path="/register/*" element={<Register />} />
        <Route path="/reginfo" element={<RegInfo />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/mytasks" element={<TaskList />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />

      </Routes>
    </div>
  );
};

export default App;

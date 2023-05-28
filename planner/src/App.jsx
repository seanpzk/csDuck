// import Message from "./Message";
// import ListGroup from "./components/unused/ListGroup";
// import Login from "./components/Login";
// import Title from "./components/Title";
// import NavbarOld from "./components/NavbarOld";

// function App() {
//   return (
//     <div>
//       {/* <NavbarOld></NavbarOld> */}
//       <Navbar></Navbar>
//       <Title></Title>
//       <Message></Message>
//       <ListGroup />
//       <Login />
//     </div>
//   );
// }

//export default App;

// ========================================================================

// BELOW IS ADDED FOR MONGODB

import React, { useState } from "react";

// We use Route in order to define the different routes of our application
import { Link, Outlet, Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/Navbar";
import Edit from "./components/Edit";
import Create from "./components/Create";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Register from "./components/Register";
import Reset from "./components/Reset";
import NotFound from "./components/NotFound";
import TaskList from "./components/TaskList";

const App = () => {
  // const [currentForm, setCurrentForm] = useState("login");

  // const toggleForm = (formName) => {
  //   setCurrentForm(formName);
  // };
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
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/mytasks" element={<TaskList />} />
      </Routes>
    </div>
  );
};

export default App;

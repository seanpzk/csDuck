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
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/Navbar";
import RecordList from "./components/RecordList";
import Edit from "./components/Edit";
import Create from "./components/Create";
import { Login } from "./components/Login";
import { Register } from "./components/Register";

const App = () => {
  const [currentForm, setCurrentForm] = useState("login");

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };
  return (
    <div>
      {currentForm === "login" ? (
        <Login onFormSwitch={toggleForm} />
      ) : (
        <Register onFormSwitch={toggleForm} />
      )}
      <Navbar />
      <Routes>
        <Route exact path="/" element={<RecordList />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  );
};

export default App;

import Message from "./Message";
import ListGroup from "./components/ListGroup";
import Login from "./components/Login";
import Title from "./components/Title";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <Title></Title>
      <Message></Message>
      {/* <ListGroup /> */}
      <Login></Login>
    </div>
  );
}

export default App;

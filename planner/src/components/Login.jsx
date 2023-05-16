import { useState } from "react";
import Axios from "axios";

export default function Login() {

    const [displayName, setDisplay] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const addUser = () => {
        Axios.post("http://localhost:3001/create", { 
        username: username,
        password: password
        }).then(() => console.log("User created"));
    }

    const displaySubmit = (event) => {
        event.preventDefault();
        addUser();
        setDisplay("Hi " + username +" ");
        };

    return (
        <form onSubmit = { displaySubmit }>
            <h1>{ displayName }Welcome to ProDuctivity</h1>
            <label>Username:</label>
            <input type = "text" onChange = { (event) => 
            setUsername(event.target.value)} />
            <label>Password:</label>
            <input type = "number" onChange = { (event) => 
            setPassword(event.target.value)} />
            <button>Add user</button>
            <button type = "submit">Create User</button>
        </form>);
}

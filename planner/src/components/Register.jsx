import { useState, React } from "react";
import { useLocation, redirect } from "react-router-dom";
import { useNavigate } from "react-router";

// I think we need to use SSL/TLS to securely send data from client to server

export default function Register() {

    const navigate = useNavigate();
    
    const [creationForm, setForm] = useState( {
        username: "",
        password: "",
    } );

    // value passed here is an object
    const updateForm = (value) => {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const newUser = creationForm;

        await fetch("http://localhost:5050/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        }).catch((error) => {
            window.alert(error);
            return;
        })
        console.log("user creation request sent");
        setForm({ username: "", password: "" });
        // resets the form once submitted
        event.target.reset();
        // ADD RESPONSE FROM SERVER -> ENSURES USER IS CREATED IN DB!!!!!!!!!!!!!!
        // For some reason, redirect doesn't work here
        navigate("/");
    }

    return (
        <>
            Register here
            {/*
                Create form object
                1) Contains uesrname, password, other variables required
                2) editing the boxes will update this form object
                3) Submitting the form, will pass this form object to the database
            */}

            <form onSubmit={ handleSubmit }>
                <label htmlFor = "username">Username: </label>
                <input type = "text" id = "username" onChange = { (event) => updateForm({ username: event.target.value }) }/>
                <label htmlFor = "password">Password: </label>
                <input type = "text" id = "password" onChange = { (event) => updateForm({ password: event.target.value }) }/>
                <button type = "submit">Create user</button>
            </form>
        </>
    )
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import firebaseAuth from "../firebase.config";
import {sendPasswordResetEmail} from "firebase/auth";
import "../stylesheets/styles.css";
import "../stylesheets/resetPassword-stylesheet.css";
import resetPasswordImg from "../assets/resetPassword.png";

export default function Reset() {

    const navigate = useNavigate();
    
    const [resetForm, setForm] = useState( {
        email: ""
    } );

    // value passed here is an object
    const updateForm = (value) => {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const updatedUser = resetForm;
        sendPasswordResetEmail(firebaseAuth, updatedUser.email)
            .then(() => console.log("Password resetted"))
            .catch(error => console.log(error.message));
        /*
        const res = await fetch("http://localhost:5050/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        })
        .then(response => response.json())
        .catch((error) => {
            window.alert(error);
            return;
        })
        */
        setForm({ email: "" });
        // resets the form once submitted
        event.target.reset();
        navigate("/login");
    }

    return (
        <>
            <form onSubmit={ handleSubmit } className = "reset-Form">
                <img src = {resetPasswordImg} className = "resetImg"></img>
                <h3>Reset Your Password</h3>
                <label htmlFor = "email">Email Address: </label>
                <input type = "text" id = "email" onChange = { (event) => updateForm({ email: event.target.value }) } required/>
                <button type = "submit">Reset password</button>
            </form>
        </>
    )
}
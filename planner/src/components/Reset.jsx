import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Reset() {

    const navigate = useNavigate();
    
    const [resetForm, setForm] = useState( {
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
        const updatedUser = resetForm;

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
        console.log(res);
        setForm({ username: "", password: "" });
        // resets the form once submitted
        event.target.reset();
        // ADD RESPONSE FROM SERVER -> ENSURES USER IS CREATED IN DB!!!!!!!!!!!!!!
        // For some reason, redirect doesn't work here
        navigate("/");
    }

    return (
        <>

            <p>Reset your password</p>

            <form onSubmit={ handleSubmit }>
                <label htmlFor = "original-username">Original Username: </label>
                <input type = "text" id = "original-username" onChange = { (event) => updateForm({ username: event.target.value }) }/>
                <label htmlFor = "password">Password: </label>
                <input type = "text" id = "password" onChange = { (event) => updateForm({ password: event.target.value }) }/>
                <button type = "submit">Reset password</button>
            </form>
        </>
    )
}
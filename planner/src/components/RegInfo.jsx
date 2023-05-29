import firebaseAuth from "../firebase.config";
import { useState } from "react";
import "../stylesheets/RegInfo-stylesheet.css";
import { backendURL } from "./helperFunctions/serverUrl";

export default function RegInfo() {
    
    const [form, setForm] = useState(
        {
            username: "",
            phoneNumber: ""
        }
    );

    const updateForm = (value) => {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        handleEmailPwCreation();
        const newUser = form;

        await fetch(`${backendURL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
        .catch((error) => {
            window.alert(error);
            return;
        })
        setForm({ username: "", phoneNumber: "" });
        // resets the form once submitted
        event.target.reset();
        // ADD RESPONSE FROM SERVER -> ENSURES USER IS CREATED IN DB!!!!!!!!!!!!!!
    }

    //const [pageNum, setPage] = useState(0);
    const [isActive, setActive] = useState( {
        page1: true,
        page2: false,
        page3: false,
    })
    //const incrPage = () => setPage(pageNum + 1);
    //const decPage = () => setPage(pageNum - 1);

    function toggleActive(value) {
        return setActive((prev) => {
            return { ...prev, ...value };
        });
    }

    function page1() {
        return (
            <div className = { isActive.page1 ? "data-step" : "disappear" }>
                <h3 className = "step-title">Step 1</h3>
                <label htmlFor = "username">Username: </label>
                <input placeholder="Enter username" name = "username" onChange= {event => updateForm({ username: event.target.value})}></input>
                <label htmlFor = "phoneNumber">Phone Number: </label>
                <input placeholder="Enter phoneNumber" name = "phoneNumber" onChange= {event => updateForm({ phoneNumber: event.target.value}) }></input>
                <button type = "button" onClick = {() => toggleActive({ page1: !isActive.page1, page2: !isActive.page2})}>Next</button>
            </div>
        )
    }

    function page2() {
        return (
            <div className = { isActive.page2 ? "data-step" : "disappear" }>
                <h3 className = "step-title">Step 2</h3>
                <label htmlFor = "email">Email: </label>
                <input placeholder = "email" name = "email"/>
                <label htmlFor = "password">Password: </label>
                <input placeholder = "password" name = "password" />
                <button type = "button" onClick = {() => toggleActive({ page1: !isActive.page1, page2: !isActive.page2})}>Previous</button>
                <button type = "button" onClick = {() => toggleActive({ page2: !isActive.page2, page3: !isActive.page3})}>Next </button>
            </div>
        )
    }

    function page3() {
       return (<div className = { isActive.page3 ? "data-step" : "disappear" }>
                <h3 className = "step-title">Step 3</h3>
                <label htmlFor = "postalCode">Postal Code: </label>
                <input placeholder = "Postal Code" name = "postalCode"/>
                <label htmlFor = "country">Country: </label>
                <input placeholder = "Country" name = "country" />
                <button type = "button" onClick = {() => toggleActive({ page2: !isActive.page2, page3: !isActive.page3})}>Previous</button>
                <button type = "submit">Submit</button>
        </div>
       )
    }

    // const componentSteps = [
    //     page1,
    //     page2,
    //     page3
    // ]

    return (
        <form onSubmit = {handleSubmit} className = "multi-step-form">
            { page1() }
            { page2() }
            { page3() }
        </form>
    );
}
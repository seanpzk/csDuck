import firebaseAuth from "../firebase.config";
import { useEffect, useState } from "react";
import "../stylesheets/RegInfo-stylesheet.css";
import { backendURL } from "./helperFunctions/serverUrl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";

export default function RegInfo() {
    
    const navigate = useNavigate();
    const [form, setForm] = useState(
        {
            firebaseUID: "",
            username: "",
            phoneNumber: "",
            email: firebaseAuth.currentUser.email
        }
    );

    const updateForm = (value) => {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    useEffect(() => updateForm({firebaseUID: firebaseAuth.currentUser.uid, email: firebaseAuth.currentUser.email}), []);

    async function handleSubmit(event) {
        event.preventDefault();
        const idToken = await firebaseAuth.currentUser?.getIdToken();
        const regForm = form;
        console.log(idToken);

        const response = await fetch(`${backendURL}/register`, {
            method: "PATCH",
            headers: {
                Authorization: "Bearer " + idToken, 
                "Content-Type": "application/json"
            },
            body: JSON.stringify(regForm),
        })
        .catch((error) => {
            window.alert(error);
            return;
        })
        setForm({ username: "", phoneNumber: "" });
        // resets the form once submitted
        event.target.reset();
        // ADD RESPONSE FROM SERVER -> ENSURES USER IS CREATED IN DB!!!!!!!!!!!!!!
        navigate("/mytasks");
    }

    // For alert banner
    const [checked, setCheck] = useState(false);

    //const [pageNum, setPage] = useState(0);
    const [isActive, setActive] = useState( {
        page1: true,
        page2: false,
        page3: false,
    })

    function toggleActive(value) {
        return setActive((prev) => {
            return { ...prev, ...value };
        });
    }

    function page1() {
        return (
            <div className = { isActive.page1 ? "data-step" : "disappear" }>
                <h3 className = "step-title">Step 1</h3>
                <h10>Your username is how your friends will see you</h10>
                <div className= "input-div">
                    <label htmlFor = "username">Username: </label>
                    <br/>
                    <input placeholder="Enter username" 
                        name = "username" 
                        id = "username" 
                        onChange= {event => updateForm({ username: event.target.value})} 
                        required />
                </div>
                <button type = "button" onClick = {() => toggleActive({ page1: !isActive.page1, page2: !isActive.page2})}>Next</button>
            </div>
        )
    }

    function page2() {
        return (
            <div className = { isActive.page2 ? "data-step" : "disappear" }>
                <h3 className = "step-title">Step 2</h3>
                <h3>Your Phone number will be used in the event you forget your email and for multi-factor Authentication</h3>
                <div className="phone-input-div">
                    <label htmlFor = "phoneNumber">Phone Number: </label>
                    <PhoneInput
                    country={"sg"}
                    onChange={(input) => updateForm({phoneNumber: input})}
                    name = "phoneNumber"
                    id = "phoneNumber"
                    dropdownClass="drop-down"
                    inputStyle= {{width: "98%", height: "100%"}}
                    containerStyle ={{width: "100%", height: "100%"}}
                    />
                </div>
                {/* <div className= "input-div">
                    <label htmlFor = "email">Email: </label>
                    <input placeholder = "email" name = "email" id = "email" />
                </div>
                <div className= "input-div">
                    <label htmlFor = "password">Password: </label>
                    <input placeholder = "password" name = "password" id = "password" />
                </div> */}
                <div className="reg-nav">
                    <button type = "button" onClick = {() => toggleActive({ page1: !isActive.page1, page2: !isActive.page2})}>Previous</button>
                    {/* <button type = "button" onClick = {() => toggleActive({ page2: !isActive.page2, page3: !isActive.page3})}>Next </button> */}
                    <button type = "submit">Submit</button>
                </div>
            </div>
        )
    }

    function page3() {
       return (<div className = { isActive.page3 ? "data-step" : "disappear" }>
                <h3 className = "step-title">Step 3</h3>
                <div className= "input-div">
                    <label htmlFor = "postalCode">Postal Code: </label>
                    <input placeholder = "Postal Code" name = "postalCode"/>
                </div>
                <div className= "input-div">
                    <label htmlFor = "country">Country: </label>
                    <input placeholder = "Country" name = "country" />
                </div>
                <div className = "reg-nav">
                    <button type = "button" onClick = {() => toggleActive({ page2: !isActive.page2, page3: !isActive.page3})}>Previous</button>
                    <button type = "submit">Submit</button>
                </div>
        </div>
       )
    }

    return (
        <>
            <div className= {checked ? "hide" : "error-alert"}>
                <span>Please complete this registration form before proceeding</span>
                <button className="alert-close" onClick = {() => setCheck(!checked)}>X</button>
            </div>
            <form onSubmit = {handleSubmit} className = "multi-step-form">
                { page1() }
                { page2() }
                { page3() }
            </form>
        </>
    );
}
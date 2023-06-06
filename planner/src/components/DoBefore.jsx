import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import React, { useState } from "react";
import firebaseAuth from "../firebase.config";
import { backendURL } from "./helperFunctions/serverUrl";

export default function DoBefore(props) {
    const animatedComponents = makeAnimated();
      // Track state of DROP-DOWN <EDITTED HERE>
    const [open, setOpen] = useState(false); // Can remove
    const [children, setChildren] = useState([]);

    async function dropDown() {
        setOpen(!open);
        const user = firebaseAuth?.currentUser;
        const idToken = await user.getIdToken();

        const response = await fetch(`${backendURL}/dropdown?UID=${user.uid}`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + idToken,  
                "Content-Type": "application/json",
            }
        });
        // array of objects
        const tasks = await response.json();
        const items = [];
        // tasks.forEach((task) => items.push({_id: task._id, name: task.name}));
        tasks.forEach((task) => items.push(task));
        setChildren(() => items.map((task) => (
        // based on specifications from react-select
        { 
            value: task,
            label: task.name,
        }
        )));
    }
    return (
        <>
            <div onMouseEnter={dropDown}>
                <label>Tasks that should be done before this (Optional)</label>
                <Select 
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={children} 
                onChange={e => {
                    console.log("E");
                    props.updateTask({doBefore: e.map(pair => pair.value)})
                }} />
            </div>
            <button type = "button">TOUCH HERE</button>
        </>
    )
}
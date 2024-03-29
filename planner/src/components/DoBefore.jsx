import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import React, { useState } from "react";
import firebaseAuth from "../firebase.config";
import { backendURL } from "./helperFunctions/serverUrl";

/**
 * Converts an array of taskId into an array of tasks containing only those tasksID specified.
 * 
 * @function taskIdToTask
 * @param {String[]} taskIdArray Array containing Strings of task._id
 * @param {Object[]} taskArray Array containing task objects obtained from mongoDB
 * @returns {Object[]} array of Task objects obtained from MongoDB
 */
export function taskIdToTask(taskIdArray, taskArray) {
    if (taskIdArray.length == 0) {
        return [];
    }
    // HashMap stores task_id : task
    const idToTask = new Map();
    taskArray.forEach(task => {
        idToTask.set(task._id, task);
    });
    return taskIdArray.map(id => idToTask.get(id));
}

/**
 * Component that is called in Create.jsx. Renders the Dropdown input bar in Creation of Tasks.
 * 
 * @param {Object} props - Property brought from Create.jsx
 * @param {function} props.updateTask - Function that sets the state of task in Create.
 * @returns HTML code for Dropdown bar.
 */
export default function DoBefore(props) {
    const animatedComponents = makeAnimated();
      // Track state of options in dropdown
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [tasks, setTasks] = useState([]);

    /**
     * Extracts previous tasks input from users from MongoDB.
     * To be as for dropdown Options.
     * Stores extracted task in {tasks} hook.
     * 
     * @function dropDown
     * @async
     * @returns void
     */
    async function dropDown() {
        const user = firebaseAuth?.currentUser;
        const idToken = await user.getIdToken();

        const response = await fetch(`${backendURL}/dropdown?UID=${user.uid}`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + idToken,  
                "Content-Type": "application/json",
            }
        });
        const dbTasks = await response.json();
        setTasks(dbTasks)
        setDropdownOptions(() => dbTasks.map((task) => (
        // based on specifications from react-select
        { 
            value: task._id,
            label: task.name,
        }
        )));
    }

    return (
        <>
            <div onMouseEnter={dropDown} data-testid='dropdown'>
                <label>Tasks that should be done before this (Optional)</label>
                <Select 
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={dropdownOptions} 
                hideSelectedOptions = {true} // doesn't work with object as value i think
                onChange={e => props.updateTask({doBefore: taskIdToTask(e.map(pair => pair.value), tasks)})} />
            </div>
        </>
    )
}
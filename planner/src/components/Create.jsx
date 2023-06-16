import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import firebaseAuth from "../firebase.config";
import { backendURL } from "./helperFunctions/serverUrl";
import DoBefore from "./DoBefore";
import verifyDAG, { extractExistingTasks } from "./helperFunctions/Toposort.jsx";

export default function Create() {
  const [task, setTask] = useState({
    name: "",
    deadline: "",
    priority: "",
    description: "",
    firebaseUID: "",
    doBefore: []
  });

  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateTask(value) {
    return setTask((prev) => {
      return { ...prev, ...value }; // this will merge the two together
    });
  }

  // Adds the current user's UID to the form
  useEffect(() => {
    const UID = firebaseAuth.currentUser.uid;
    updateTask({ firebaseUID: UID });
  }, []);

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newTask = { ...task }; // why do we need the ... here?
    console.log(newTask);
    // ============= <ADDED CODE HERE =============
    if (await verifyDAG(newTask, await extractExistingTasks())) {
      console.log("DAG Present");
      await fetch(`${backendURL}/task`, {
        method: "POST", // send data to the server
        headers: {
          "Content-Type": "application/json", // indicates that the request body is in json format
        },
        body: JSON.stringify(newTask), // convert based on HTTP request format (Google the formats)
      }).catch((error) => {
        window.alert(error);
        return;
      });
    } else {
      console.log("NO DAG present");
    }

    setTask({
      name: "",
      deadline: "",
      priority: "",
      description: "",
      firebaseUID: "",
      doBefore: []
    });
    navigate("/mytasks");
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div style={{ margin: 10 }}>
      <h3>Add new task</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Task Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={task.name}
            onChange={(e) => updateTask({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Deadline">Deadline</label>
          <input
            type="date"
            className="form-control"
            id="deadline"
            value={task.deadline}
            onChange={(e) => updateTask({ deadline: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Description"> Task description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={task.description}
            onChange={(e) => updateTask({ description: e.target.value })}
          />
        </div>
        <label htmlFor="Priority">Priority</label>
        <div className="form-group">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="priorityOptions"
              id="priorityLow"
              value="Low"
              checked={task.priority === "Low"}
              onChange={(e) => updateTask({ priority: e.target.value })}
            />
            <label htmlFor="priorityLow" className="form-check-label">
              Low
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="priorityOptions"
              id="priorityMedium"
              value="Medium"
              checked={task.priority === "Medium"}
              onChange={(e) => updateTask({ priority: e.target.value })}
            />
            <label htmlFor="priorityMedium" className="form-check-label">
              Medium
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="priorityOptions"
              id="priorityHigh"
              value="High"
              checked={task.priority === "High"}
              onChange={(e) => updateTask({ priority: e.target.value })}
            />
            <label htmlFor="priorityHigh" className="form-check-label">
              High
            </label>
          </div>
        </div>
        <DoBefore updateTask = {updateTask} />
        <div className="form-group">
          <input type="submit" value="Add task" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}

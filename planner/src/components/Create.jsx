import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import firebaseAuth from "../firebase.config";
import { backendURL } from "./helperFunctions/serverUrl";
import DoBefore from "./DoBefore";
import verifyDAG, { Toposort, extractExistingTasks } from "./helperFunctions/Toposort.jsx";

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
    const newTask = { ...task };
    if (await verifyDAG(newTask, await extractExistingTasks())) {
      console.log("DAG Present");
      const idToken = await firebaseAuth.currentUser?.getIdToken();
      await fetch(`${backendURL}/task`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + idToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
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
      <form onSubmit={onSubmit} data-testid="create-form">
        <div className="form-group">
          <label htmlFor="name" data-testid="name-label">Task Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={task.name}
            onChange={(e) => updateTask({ name: e.target.value })}
            required
            data-testid="name-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Deadline" data-testid="deadline-label">Deadline</label>
          <input
            type="date"
            className="form-control"
            id="deadline"
            value={task.deadline}
            onChange={(e) => updateTask({ deadline: e.target.value })}
            data-testid="deadline-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Description" data-testid="description-label"> Task description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={task.description}
            onChange={(e) => updateTask({ description: e.target.value })}
            data-testid="description-input"
          />
        </div>
        <label htmlFor="Priority" data-testid="priority-label">Priority</label>
        <div className="form-group">
          <div className="form-check form-check-inline">
          <label htmlFor="priorityLow" className="form-check-label" data-testid='low-priority-label'>
            <input
              className="form-check-input"
              type="radio"
              name="priorityOptions"
              id="priorityLow"
              value="Low"
              checked={task.priority === "Low"}
              onChange={(e) => updateTask({ priority: e.target.value })}
              required
              data-testid='low-priority-input'
            />
            Low
          </label>
          </div>
          <div className="form-check form-check-inline">
          <label htmlFor="priorityMedium" className="form-check-label" data-testid='med-priority-label'>
            <input
              className="form-check-input"
              type="radio"
              name="priorityOptions"
              id="priorityMedium"
              value="Medium"
              checked={task.priority === "Medium"}
              onChange={(e) => updateTask({ priority: e.target.value })}
              data-testid='med-priority-input'
            />
              Medium
          </label>
          </div>
          <div className="form-check form-check-inline">
          <label htmlFor="priorityHigh" className="form-check-label" data-testid='high-priority-label'>
            <input
              className="form-check-input"
              type="radio"
              name="priorityOptions"
              id="priorityHigh"
              value="High"
              checked={task.priority === "High"}
              onChange={(e) => updateTask({ priority: e.target.value })}
              data-testid='high-priority-input'
            />
              High
          </label>
          </div>
        </div>
        <DoBefore updateTask = {updateTask} />
        <div className="form-group">
          <input type="submit" value="Add task" className="btn btn-primary" data-testid="submit-button"/>
        </div>
      </form>
    </div>
  );
}

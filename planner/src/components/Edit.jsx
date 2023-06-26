import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import firebaseAuth from "../firebase.config";
import DoBefore from "./DoBefore";
import verifyDAG, {
  extractExistingTasks,
} from "./helperFunctions/Toposort.jsx";

export default function Edit() {
  const [form, setForm] = useState({
    name: "",
    deadline: "",
    priority: "",
    description: "",
    doBefore: [],
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const idToken = await firebaseAuth.currentUser?.getIdToken();
      const id = params.id.toString();
      const response = await fetch(
        `http://localhost:5050/task/${params.id.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + idToken,
          },
        }
      );

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      if (!record) {
        window.alert(`Task with MongoDb_id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedPerson = {
      _id: params.id,
      name: form.name,
      deadline: form.deadline,
      priority: form.priority,
      description: form.description,
      doBefore: form.doBefore,
    };
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    if (await verifyDAG(editedPerson, await extractExistingTasks())) {
      console.log("DAG PRESENT");
      // This will send a post request to update the data in the database.
      await fetch(`http://localhost:5050/task/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(editedPerson),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + idToken,
        },
      });
    } else {
      console.log("CYCLE FOUND");
    }

    navigate("/mytasks");
  }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <h3>Update Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="deadline">Deadline: </label>
          <input
            type="date"
            className="form-control"
            id="deadline"
            value={form.deadline}
            onChange={(e) => updateForm({ deadline: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Task description: </label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="priorityOptions"
              id="priorityLow"
              value="Low"
              checked={form.priority === "Low"}
              onChange={(e) => updateForm({ priority: e.target.value })}
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
              checked={form.priority === "Medium"}
              onChange={(e) => updateForm({ priority: e.target.value })}
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
              checked={form.priority === "High"}
              onChange={(e) => updateForm({ priority: e.target.value })}
            />
            <label htmlFor="priorityHigh" className="form-check-label">
              High
            </label>
          </div>
        </div>
        <br />
        {/* ======= Edit DONE HERE ==========*/}
        <DoBefore task={form} updateTask={updateForm} />
        {/* ==========EDIT ENDS HERE ===============*/}

        <div className="form-group">
          <input
            type="submit"
            value="Update Record"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}

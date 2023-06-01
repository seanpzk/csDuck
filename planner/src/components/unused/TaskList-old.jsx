import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import "../styles.css";
import "bootstrap/dist/css/bootstrap.css";
import firebaseAuth from "../../firebase.config";
import RedirectLogin from "../helperFunctions/RedirectLogin";

const Task = (props) => (
  <tr>
    <td>{props.task.name}</td>
    <td>{props.task.deadline}</td>
    <td>{props.task.priority}</td>
    <td>
      <Link className="btn btn-link" to={`/edit/${props.task._id}`}>
        Edit
      </Link>{" "}
      |
      <button
        className="btn btn-link"
        onClick={() => {
          props.deleteTask(props.task._id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // This method fetches the tasks from the database.
  useEffect(() => {
    async function getTasks() {
      const idToken = await firebaseAuth.currentUser?.getIdToken();
      const UID = firebaseAuth.currentUser.uid;
      // creates a default GET request -> included UID
      const response = await fetch(`http://localhost:5050/task?UID=${UID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + idToken,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const tasks = await response.json();
      setTasks(tasks);
    }

    getTasks();

    return;
  }, [tasks.length]);

  // This method will delete a task
  async function deleteTask(id) {
    // Send whenever we make a request to backend
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    await fetch(`http://localhost:5050/task/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + idToken,
      },
    }).then((response) => RedirectLogin(response, navigate));

    const newTasks = tasks.filter((el) => el._id !== id);
    setTasks(newTasks);
  }

  // This method will map out the tasks on the table
  function taskList() {
    return tasks.map((task) => {
      return (
        <Task
          task={task}
          deleteTask={() => deleteTask(task._id)}
          key={task._id}
        />
      );
    });
  }

  // This following section will display the table with the tasks of individuals.
  return (
    <>
      <div>
        <h3 style={{ textAlign: "center", margin: 15 }}>📚Task List</h3>{" "}
        <div className="tasklist-container">
          <table className="table table-bordered table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">{taskList()}</tbody>
          </table>
          <NavLink
            className="nav-link btn"
            style={{
              color: "white",
              backgroundColor: "green",
              padding: "0.5%",
              fontSize: "100%",
              width: "8%",
            }}
            to="/create"
          >
            + Add new task
          </NavLink>
        </div>
      </div>
    </>
  );
}

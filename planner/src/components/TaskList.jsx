import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import firebaseAuth from "../firebase.config";
import { backendURL } from "./helperFunctions/serverUrl";
import RedirectLogin from "./helperFunctions/RedirectLogin";
import ShowTaskInfo from "./ShowTaskInfo";
import "../stylesheets/styles.css";

const Task = (props) => (
  <div>
    <li
      className="list-items"
      draggable
      onDragStart={(e) => (props.dragItem.current = props.index)}
      onDragEnter={(e) => (props.dragOverItem.current = props.index)}
      onDragEnd={props.handleSort}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* {props.task.name} */}
      <ShowTaskInfo task={props.task}></ShowTaskInfo>
      <colgroup />
      {/* {props.task.deadline}&nbsp; */}
      {props.task.deadline || "nil"}
      <colgroup />
      {/* {props.task.priority}&nbsp; */}
      {props.task.priority || "nil"}
      <colgroup />
      <button
        className="btn btn-link"
        style={{ paddingLeft: 0, fontSize: "calc(3px + 0.7vw)" }}
      >
        <Link to={`/edit/${props.task._id}`}>Edit</Link>
      </button>
      |
      <button
        className="btn btn-link "
        style={{ fontSize: "calc(3px + 0.7vw)" }}
        onClick={() => {
          props.deleteTask(props.task._id);
        }}
      >
        Delete
      </button>
    </li>
  </div>
);

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [taskInfo, setTaskInfo] = useState({
    name: "",
    deadline: "",
    priority: "",
    description: "",
    customPriority: "",
    useCustomPriority: "",
  });

  const navigate = useNavigate();

  // This method fetches the tasks from the database.
  useEffect(() => {
    async function getTasks() {
      const idToken = await firebaseAuth.currentUser?.getIdToken();
      // console.log(firebaseAuth.currentUser);
      const UID = firebaseAuth.currentUser.uid;
      // creates a default GET request -> included UID
      const response = await fetch(`${backendURL}/task?UID=${UID}`, {
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
    await fetch(`${backendURL}/task/${id}`, {
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
    return tasks.map((task, index) => {
      return (
        <Task
          task={task}
          deleteTask={() => deleteTask(task._id)}
          key={task._id}
          index={index}
          dragItem={dragItem}
          dragOverItem={dragOverItem}
          handleSort={handleSort}
        />
      );
    });
  }

  // Reference for dragItem and dragOverItem
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  //handle drag sorting
  const handleSort = () => {
    // duplicate items
    let _tasks = [...tasks];

    //remove and save the dragged item content
    const draggedItemContent = _tasks.splice(dragItem.current, 1)[0];

    //switch the position
    _tasks.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    setTasks(_tasks);
  };

  async function getTaskData(task) {
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    const response = await fetch(`http://localhost:5050/task/${task._id}`, {
      method: "GET",
      header: {
        Authorization: "Bearer " + idToken,
      },
    });

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
    console.log(record);
    setTaskInfo(record);
  }

  //Save the modified task order after performing dnd
  function saveTaskOrder(e) {
    e.preventDefault();
    return tasks.map((task, index) => {
      getTaskData(task);
      updateTaskInfo({ customPriority: index, useCustomPriority: true });
      console.log("taskInfo is now:");
      console.log(taskInfo);
      submitTaskInfo(e, task);
    });
  }

  // These methods will update the state properties.
  function updateTaskInfo(value) {
    console.log("updating");
    return setTaskInfo((prev) => {
      return { ...prev, ...value };
    });
  }

  async function submitTaskInfo(e, task) {
    e.preventDefault();
    const editedTask = {
      name: taskInfo.name,
      deadline: taskInfo.deadline,
      priority: taskInfo.priority,
      description: taskInfo.description,
      customPriority: taskInfo.customPriority,
      useCustomPriority: taskInfo.useCustomPriority,
    };
    const idToken = await firebaseAuth.currentUser?.getIdToken();

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5050/task/${task._id}`, {
      method: "PATCH",
      body: JSON.stringify(editedTask),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
    });

    navigate("/mytasks");
  }

  // This following section will display the table with the tasks of individuals.
  return (
    <>
      {/* {console.log(tasks)} */}

      <div className="list taskListPage ">
        <h3 style={{ textAlign: "center", margin: 15 }}>📚Task List</h3>{" "}
        <div>
          {/* <table className="table table-bordered table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">{taskList()}</tbody>
          </table> */}

          <div className="lines"></div>
          {
            <ul id="List">
              <li
                style={{
                  borderBottom: " double darkgrey",
                  // borderTop: "double darkgrey",
                }}
              >
                Task Name <colgroup />
                Deadline <colgroup />
                Priority <colgroup />
                Action
              </li>
              {taskList()}
            </ul>
          }

          <NavLink
            className="nav-link btn"
            style={{
              color: "white",
              backgroundColor: "green",
              padding: "0.5%",
              fontSize: "80%",
              fontWeight: "normal",
              width: "18%",
              marginLeft: 75,
              marginTop: 10,
            }}
            to="/create"
            draggable="false"
          >
            ✏️ Add new task
          </NavLink>
          <button
            className="btn btn-primary "
            style={{ fontSize: "80%" }}
            onClick={saveTaskOrder}
          >
            Save current task order
          </button>
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import firebaseAuth from "../firebase.config";
import { backendURL } from "./helperFunctions/serverUrl";
import RedirectLogin from "./helperFunctions/RedirectLogin";
import ShowTaskInfo from "./ShowTaskInfo";
import "../stylesheets/styles.css";
import { useNonInitialEffect } from "./useNonInitialEffect";
import { Toposort, extractExistingTasks } from "./helperFunctions/Toposort.jsx";

/**
 * Display the information of task in a row.
 * @param {*} props
 * @returns Name, deadline, priority of task displayed, has "Edit" and "Delete" function.
 */
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
  const [customPrio, setCustomPrio] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskInfo, setTaskInfo] = useState({
    name: "",
    deadline: "",
    priority: "",
    description: "",
    doBefore: [],
    customPriority: "",
  });

  const navigate = useNavigate();
  const [topoTask, setTopo] = useState([]);

  // This method tells whether customPrio is enabled or disabled when site is first rendered.
  useEffect(() => {
    async function getCustomPrio() {
      const currentUser = firebaseAuth.currentUser;
      if (currentUser == null) {
        console.log("currentUser is null");
        return;
      }
      const idToken = await firebaseAuth.currentUser?.getIdToken();
      const UID = firebaseAuth.currentUser.uid;
      // creates a default GET request -> included UID
      const response = await fetch(`${backendURL}/tasklist?UID=${UID}`, {
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
      const result = await response.json();
      if (result[0] == undefined) {
        setCustomPrio(false);
      } else {
        setCustomPrio(result[0].useCustomPriority);
      }
    }

    getCustomPrio();

    return;
  }, [tasks.length]);

  // This method fetches the tasks from the database.
  useNonInitialEffect(() => {
    async function getTasks() {
      const currentUser = firebaseAuth.currentUser;
      if (currentUser == null) {
        console.log("currentUser is null");
        return;
      }
      const idToken = await firebaseAuth.currentUser?.getIdToken();

      console.log(currentUser);

      const UID = firebaseAuth.currentUser.uid;
      // creates a default GET request -> included UID
      const response = await fetch(
        `${backendURL}/task?UID=${UID}&UCP=${customPrio}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + idToken,
            "Content-Type": "application/json",
          },
        }
      );

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
  }, [customPrio]);

  /**
   * Update the database that current user's tasklist is NOT sorted by custom priority.
   */
  async function customPriorityFalse() {
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    const ucp = {
      useCustomPriority: false,
      UID: firebaseAuth.currentUser.uid,
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5050/tasklist`, {
      method: "PATCH",
      body: JSON.stringify(ucp),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
    });
  }

  /**
   * Update the database that current user's tasklist is sorted by custom priority.
   */
  async function customPriorityTrue() {
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    const ucp = {
      useCustomPriority: true,
      UID: firebaseAuth.currentUser.uid,
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5050/tasklist`, {
      method: "PATCH",
      body: JSON.stringify(ucp),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
    });
  }

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
  function taskList(tasks) {
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

  async function getTaskData(task, index) {
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    const response = await fetch(`http://localhost:5050/task/${task._id}`, {
      method: "GET",
      headers: {
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
    setTaskInfo({ ...record, customPriority: index });
  }

  useNonInitialEffect(() => {
    submitTaskInfo(taskInfo);
  }, [taskInfo]);

  // useNonInitialEffect(() => {}, [taskInfo]);

  //Save the modified task order after performing dnd
  async function saveTaskOrder() {
    let index = 0;
    let _tasks = structuredClone(tasks);
    for await (const t of _tasks) {
      await getTaskData(t, index);
      index++;
    }
    await customPriorityTrue();
    setCustomPrio(true);
  }

  /**
   * Functionality to set the task list to be sorted using default way.
   */
  async function useDefaultSort() {
    await customPriorityFalse();
    if (customPrio == undefined) {
      setCustomPrio(false);
    } else if (customPrio == false) {
      setCustomPrio(undefined);
    } else {
      setCustomPrio(false);
    }
  }

  /**
   * Updates information of task to database.
   * @param {*} taskInfo - Contains information of a task object.
   */
  async function submitTaskInfo(taskInfo) {
    let _taskInfo = structuredClone(taskInfo);
    const editedTask = {
      name: _taskInfo.name,
      deadline: _taskInfo.deadline,
      priority: _taskInfo.priority,
      description: _taskInfo.description,
      doBefore: _taskInfo.doBefore,
      customPriority: _taskInfo.customPriority,
    };
    const idToken = await firebaseAuth.currentUser?.getIdToken();

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5050/task/${_taskInfo._id}`, {
      method: "PATCH",
      body: JSON.stringify(editedTask),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
    });

    navigate("/mytasks");
  }

  async function useToposort(e) {
    let topoList = await Toposort(await extractExistingTasks());
    setTasks(topoList);
  }

  // This following section will display the table with the tasks of individuals.
  return (
    <>
      <div className="list taskListPage " data-testid="tasklistTitle">
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
            <ul id="List" data-testid="tasklistHeaders">
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
              {taskList(tasks)}
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
          >
            ✏️ Add new task
          </NavLink>

          <button
            className="btn btn-primary "
            style={{
              color: "black",
              backgroundColor: "lightblue",
              borderColor: "black",
              border: "none",
              padding: "0.5%",
              fontSize: "80%",
              fontWeight: "normal",
              fontFamily: "Arial",
              width: "12%",
              margin: 18,
            }}
            onClick={saveTaskOrder}
          >
            Save current task order
          </button>
          <button
            className="btn btn-primary "
            style={{
              color: "black",
              backgroundColor: "lightblue",
              // borderColor: "black",
              border: "none",
              padding: "0.5%",
              fontSize: "80%",
              fontWeight: "normal",
              fontFamily: "Arial",
              width: "12%",
              margin: 18,
            }}
            onClick={useDefaultSort}
          >
            Reset to default sort order
          </button>
        </div>
        <button type="button" onClick={useToposort}>
          Auto sort
        </button>
      </div>
    </>
  );
}

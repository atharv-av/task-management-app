import React, { Component } from "react";
import Task from "./components/Task";
import NewTaskForm from "./components/NewTaskForm";
import SortBy from "./components/SortBy";
import "./css/App.css";
import { encodeUpdateValue, convertToNumber } from "./utilityFunctions";

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      error: null,
      isFetched: false,
      tasks: [],
      taskOrder: {
        orderByField: "task_creation_dt",
        direction: "Descending",
      },
      newTaskTitle: "",
    };

    this.getAllTasks = this.getAllTasks.bind(this);
    this.putTaskUpdate = this.putTaskUpdate.bind(this);
    this.handleTaskUpdate = this.handleTaskUpdate.bind(this);
    this.handleNewTaskChange = this.handleNewTaskChange.bind(this);
    this.postNewTask = this.postNewTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.sortTasks = this.sortTasks.bind(this);
  }

  async getAllTasks(newTask) {
    const { orderByField, direction } = this.state.taskOrder;

    const url = `http://localhost:8000/allTasks`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.statusText}`);
      const data = await res.json();
      this.setState({
        isFetched: true,
        tasks: data,
      });
    } catch (error) {
      this.setState({
        error: error.message,
        isFetched: true,
      });
    }
  }

  handleTaskUpdate(e) {
    const taskID = Number(e.target.parentNode.id);
    const fieldToUpdate = e.target.name;
    let updateValue;

    if (fieldToUpdate === "task_completed") {
      updateValue = e.target.checked;
    } else if (fieldToUpdate === "task_scheduled_dt") {
      if (e.target.value !== "") {
        updateValue = e.target.value + "T00:00:00.000Z";
      } else {
        updateValue = null;
      }
    } else {
      updateValue = e.target.value;
    }

    const updatedTaskState = this.state.tasks.map((task) => {
      const updateTask = (task) => {
        const taskCopy = JSON.parse(JSON.stringify(task));
        taskCopy[fieldToUpdate] = updateValue;

        return taskCopy;
      };

      if (task.task_id === taskID) {
        return updateTask(task);
      } else {
        return task;
      }
    });

    this.setState({ tasks: updatedTaskState });
  }

  putTaskUpdate(e) {
    const taskID = Number(e.target.parentNode.id);  // Get task ID
    const fieldToUpdate = e.target.name;  // Get the field being updated
    let updateValue;
  
    // Get the value to update from the state
    this.state.tasks.forEach((task) => {
      if (task.task_id === taskID) updateValue = task[fieldToUpdate];
    });
  
    // Special handling for task_scheduled_dt
    if (fieldToUpdate === "task_scheduled_dt" && updateValue === "") {
      updateValue = null;  // Set it to null if the field is empty
    }
  
    // Do not update if task title is empty
    if (fieldToUpdate === "task_title" && updateValue === "") return;
  
    // If the value is empty and not task_scheduled_dt, set it to 'null' for backend
    if (updateValue === "" && fieldToUpdate !== "task_scheduled_dt") {
      updateValue = "null";
    }
  
    // Prepare the payload
    const payload = {
      taskID: taskID,
      fieldName: fieldToUpdate,
      newValue: updateValue,
    };
  
    // Send the PUT request with taskID, fieldName, and newValue in the body
    fetch("http://localhost:8000/amendTask", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),  // Send payload in the body
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(`${fieldToUpdate} of task ${taskID} updated`);
        } else {
          console.error("Failed to update task");
        }
      })
      .catch((error) => console.error("Error updating task:", error));
  }
  
  
  
  async deleteTask(taskID) {
    if (window.confirm("Are you sure that you want to delete this task?")) {
      const url = `http://localhost:8000/deleteTask/${taskID}`;
      try {
        const res = await fetch(url, { method: "DELETE" });
        if (res.ok) {
          this.getAllTasks(false);
        } else {
          throw new Error(`Failed to delete task: ${res.statusText}`);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  handleNewTaskChange(e) {
    const newTaskTitle = e.target.value;

    this.setState({ newTaskTitle });
  }

  async postNewTask() {
    const { newTaskTitle } = this.state;

    if (!newTaskTitle.trim()) {
        alert("Task title cannot be empty.");
        return;
    }

    const url = `http://localhost:8000/addTask`;
    const payload = { taskTitle: newTaskTitle.trim() };

    console.log("Creating task with payload:", payload);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Ensure content-type is set to application/json
            },
            body: JSON.stringify(payload), // Send as JSON
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to create task.");
        }

        const data = await res.json();
        console.log("Task created successfully:", data);

        this.setState({ newTaskTitle: "" });
        this.getAllTasks(); // Refresh tasks after successful creation
    } catch (error) {
        console.error("Error creating task:", error.message);
        alert(error.message);
    }
}



  sortTasks(selectValue) {
    const { orderByField, direction } = selectValue;

    const allNulls = this.state.tasks.every((val) => {
      return val[orderByField] === null;
    });

    if (allNulls) return;

    const reorderedTasks = this.state.tasks
      .map((val) => {
        return val;
      })
      .sort((a, b) => {
        const firstVal = convertToNumber(a[orderByField]);
        const secondVal = convertToNumber(b[orderByField]);

        if (firstVal === null && secondVal === null) {
          return (
            convertToNumber(b.task_creation_dt) -
            convertToNumber(a.task_creation_dt)
          );
        }

        if (firstVal === null) {
          return 1;
        }

        if (secondVal === null) {
          return -1;
        }

        if (direction === "Ascending") {
          return firstVal - secondVal;
        }

        if (direction === "Descending") {
          return secondVal - firstVal;
        }

        return 0;
      });

    this.setState({
      tasks: reorderedTasks,
      taskOrder: {
        orderByField,
        direction,
      },
    });
  }

  componentDidMount() {
    this.getAllTasks(false);
  }

  render() {
    const { error, isFetched } = this.state;
    if (error) {
      return (
        <section>
          <p>Sorry, something went wrong. Please try again.</p>
        </section>
      );
    } else if (!isFetched) {
      return (
        <section>
          <p>Your tasks are loading...</p>
        </section>
      );
    } else {
      const tasks = this.state.tasks.map((task) => {
        return (
          <Task
            key={task.task_id}
            task={task}
            handleTaskUpdate={this.handleTaskUpdate}
            putTaskUpdate={this.putTaskUpdate}
            deleteTask={this.deleteTask}
          />
        );
      });
      return (
        <section className="tasksContainer">
          <NewTaskForm
            newTaskTitle={this.state.newTaskTitle}
            handleNewTaskChange={this.handleNewTaskChange}
            postNewTask={this.postNewTask}
          />
          {tasks.length > 0 ? <SortBy sortTasks={this.sortTasks} /> : null}
          {tasks}
        </section>
      );
    }
  }
}

export default App;

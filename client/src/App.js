import React, { Component } from "react";
import Task from "./components/Task";
import NewTaskForm from "./components/NewTaskForm";
import SortBy from "./components/SortBy";
import "./css/App.css";
import { convertToNumber } from "./utilityFunctions";
import Header from "./components/Header";
import { SignedIn } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import SearchTasks from "./components/SearchTasks";

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
    this.handleSearchResults = this.handleSearchResults.bind(this);
  }

  async getAllTasks(newTask) {
    const { orderByField, direction } = this.state.taskOrder;

    const url = `${process.env.REACT_APP_API_URL}/allTasks`;
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
      toast.error("Failed to fetch tasks. Please try again.");
    }
  }

  handleSearchResults(results) {
    this.setState({ tasks: results });
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
    const taskID = Number(e.target.parentNode.id);
    const fieldToUpdate = e.target.name;
    let updateValue;

    this.state.tasks.forEach((task) => {
      if (task.task_id === taskID) updateValue = task[fieldToUpdate];
    });

    if (fieldToUpdate === "task_scheduled_dt" && updateValue === "") {
      updateValue = null;
    }

    if (fieldToUpdate === "task_title" && updateValue === "") return;

    if (updateValue === "" && fieldToUpdate !== "task_scheduled_dt") {
      updateValue = "null";
    }
    const payload = {
      taskID: taskID,
      fieldName: fieldToUpdate,
      newValue: updateValue,
    };

    const loadingToast = toast.loading("Updating task...");

    fetch(`${process.env.REACT_APP_API_URL}/amendTask`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Task updated successfully", {
            id: loadingToast,
          });
        } else {
          throw new Error("Failed to update task");
        }
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        toast.error("Failed to update task", {
          id: loadingToast,
        });
      });
  }

  async deleteTask(taskID) {
    if (window.confirm("Are you sure that you want to delete this task?")) {
      const url = `${process.env.REACT_APP_API_URL}/deleteTask/${taskID}`;
      const loadingToast = toast.loading("Deleting task...");

      try {
        const res = await fetch(url, { method: "DELETE" });
        if (res.ok) {
          this.getAllTasks(false);
          toast.success("Task deleted successfully", {
            id: loadingToast,
          });
        } else {
          throw new Error(`Failed to delete task: ${res.statusText}`);
        }
      } catch (error) {
        console.error(error.message);
        toast.error("Failed to delete task", {
          id: loadingToast,
        });
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
      toast.error("Task title cannot be empty");
      return;
    }

    const url = `${process.env.REACT_APP_API_URL}/addTask`;
    const payload = { taskTitle: newTaskTitle.trim() };
    const loadingToast = toast.loading("Creating new task...");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create task.");
      }

      const data = await res.json();
      this.setState({ newTaskTitle: "" });
      this.getAllTasks();

      toast.success("Task created successfully", {
        id: loadingToast,
      });
    } catch (error) {
      console.error("Error creating task:", error.message);
      toast.error(error.message || "Failed to create task", {
        id: loadingToast,
      });
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
          <Toaster position="top-right" />
        </section>
      );
    } else if (!isFetched) {
      return (
        <section>
          <p>Your tasks are loading...</p>
          <Toaster position="top-right" />
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
          <Header />
          <SignedIn>
            <NewTaskForm
              newTaskTitle={this.state.newTaskTitle}
              handleNewTaskChange={this.handleNewTaskChange}
              postNewTask={this.postNewTask}
            />
            <SearchTasks onSearchResults={this.handleSearchResults} />
            {tasks.length > 0 ? <SortBy sortTasks={this.sortTasks} /> : null}
            {tasks}
            <Toaster position="top-right" />
          </SignedIn>
        </section>
      );
    }
  }
}

export default App;

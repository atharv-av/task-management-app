import React from "react";
import NewTaskButton from "./NewTaskButton";
import "../css/NewTaskForm.css";

const NewTaskForm = (props) => {
  const { newTaskTitle, handleNewTaskChange, postNewTask } = props;

  // Handle form submit explicitly to prevent accidental submits
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    postNewTask(); // Manually trigger task creation
  };

  return (
    <div className="newTaskForm">
      <form onSubmit={handleSubmit}>
        <input
          className="newTaskForm__titleInput"
          type="text"
          placeholder="Task Title"
          value={newTaskTitle}
          onChange={handleNewTaskChange} // Update state as user types
        />
        <NewTaskButton postNewTask={postNewTask} /> {/* Button to trigger postNewTask */}
      </form>
    </div>
  );
};

export default NewTaskForm;

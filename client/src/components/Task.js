import React from "react";
import DeleteTaskButton from "./DeleteTaskButton";
import "../css/Task.css";

const Task = (props) => {
  const {
    task_id: taskID,
    task_title: taskTitle,
    task_desc: taskDesc,
    task_completed: taskCompleted,
    task_scheduled_dt: taskScheduledDt,
    priority_desc: priorityDesc,
  } = props.task;

  const cleanedScheduledDt = taskScheduledDt ? taskScheduledDt.substring(0, 10) : "";

  const priorityColour = priorityDesc === "High" ? "task__priority--high" : "task__priority";

  return (
    <div className="task">
      <form id={taskID} autoComplete="off">
        {/* Task Title */}
        <input
          className="task__title"
          type="text"
          name="task_title"  // Ensure this matches the backend field name
          value={taskTitle}
          onChange={props.handleTaskUpdate}
          onBlur={props.putTaskUpdate}  // Update on blur
        />
        
        {/* Task Completed */}
        <input
          className="task__completed"
          type="checkbox"
          name="task_completed"  // This field corresponds to the "task_completed" field in the backend
          checked={taskCompleted}
          onChange={props.handleTaskUpdate}
          onBlur={props.putTaskUpdate}
        />
        
        {/* Task Description */}
        <textarea
          className="task__desc"
          name="task_desc"  // This should match the backend field "task_desc"
          rows="3"
          cols="20"
          value={taskDesc}
          onChange={props.handleTaskUpdate}
          onBlur={props.putTaskUpdate}
        />
        
        {/* Task Scheduled Date */}
        <input
          className="task__scheduledDt"
          type="date"
          name="task_scheduled_dt"  // This matches the "task_scheduled_dt" field in the backend
          value={cleanedScheduledDt}
          onChange={props.handleTaskUpdate}
          onBlur={props.putTaskUpdate}
        />
        
        {/* Priority Dropdown */}
        <select
          className={priorityColour}
          name="priority_desc"  // Matches "priority_desc" in the backend
          value={priorityDesc}
          onChange={props.handleTaskUpdate}
          onBlur={props.putTaskUpdate}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        
        <DeleteTaskButton deleteTask={props.deleteTask} taskID={taskID} />
      </form>
    </div>
  );
};

export default Task;

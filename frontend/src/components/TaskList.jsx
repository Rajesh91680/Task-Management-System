import React from "react";

const TaskList = () => {
  const tasks = [
    { id: 1, title: "Learn Django", status: "Pending" },
    { id: 2, title: "Build React App", status: "Completed" },
  ];

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

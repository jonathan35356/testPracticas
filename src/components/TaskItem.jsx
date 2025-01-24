import React from 'react';

const TaskItem = ({ task }) => {
  return (
    <li>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Prioridad: {task.priority}</p>
      <p>Estado: {task.status}</p>
    </li>
  );
};

export default TaskItem;

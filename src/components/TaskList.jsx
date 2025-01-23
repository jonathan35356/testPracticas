import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(); // Refrescar la lista de tareas
    } catch (error) {
      console.error('Error actualizando tarea:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>{task.dueDate}</p>
          <p>Prioridad: {task.priority}</p>
          <p>Estado: {task.status}</p>
          <button onClick={() => handleStatusChange(task._id, 'Completada')}>Marcar como Completada</button>
          <button onClick={() => handleStatusChange(task._id, 'Pendiente')}>Marcar como Pendiente</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;

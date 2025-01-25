import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Baja',
  });

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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refrescar la lista de tareas después de crear una nueva
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Baja' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error creando tarea:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  return (
    <div>
      <h2>Tareas</h2>
      
      {/* Formulario para crear tarea */}
      <h3>Crear nueva tarea</h3>
      <form onSubmit={handleCreateTask}>
        <input 
          type="text" 
          value={newTask.title} 
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
          placeholder="Título" 
          required 
        />
        <input 
          type="text" 
          value={newTask.description} 
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
          placeholder="Descripción" 
          required 
        />
        <input 
          type="date" 
          value={newTask.dueDate} 
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} 
          required 
        />
        <select 
          value={newTask.priority} 
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <button type="submit">Crear tarea</button>
      </form>

      {/* Mostrar las tareas */}
      <div>
        {tasks.map((task) => (
          <div key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>{task.dueDate}</p>
            <p>Prioridad: {task.priority}</p>
            <p>Estado: {task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

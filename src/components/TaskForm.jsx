import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ token, fetchTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Media');
  const [status, setStatus] = useState('Pendiente');

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/tasks', { title, description, dueDate, priority, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(); // Refrescar la lista de tareas
    } catch (error) {
      console.error('Error creando tarea:', error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pendiente">Pendiente</option>
        <option value="Completada">Completada</option>
      </select>
      <button onClick={handleSubmit}>Guardar Tarea</button>
    </div>
  );
};

export default TaskForm;

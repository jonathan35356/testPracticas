import React, { useState } from 'react';
import axios from 'axios';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Baja');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/tasks',
        { title, description, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Tarea agregada');
    } catch (error) {
      alert('Error al agregar tarea');
    }
  };

  return (
    <div>
      <h2>Agregar tarea</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" required />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <button type="submit">Agregar tarea</button>
      </form>
    </div>
  );
};

export default AddTask;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Baja',
  });
  const [error, setError] = useState(null); // Estado para manejar errores

  const navigate = useNavigate(); // Hook para redirección

  // Función para obtener las tareas
  const fetchTasks = async () => {
    if (!token) {
      setError('Token no válido. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      setError('Error al obtener las tareas.');
    }
  };

  // Función para crear una nueva tarea
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description || !newTask.dueDate || !newTask.priority) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refrescar la lista de tareas después de crear una nueva
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Baja' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error creando tarea:', error);
      setError('Error al crear la tarea.');
    }
  };

  // Función para redirigir a la edición de tarea
  const handleEditTask = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  // Llamar a fetchTasks al cargar el componente o cuando cambie el token
  useEffect(() => {
    fetchTasks();
  }, [token]);

  return (
    <div>
      <h2>Tareas</h2>

      {/* Mostrar errores si existen */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

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
          <div key={task._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Fecha de vencimiento: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Prioridad: {task.priority}</p>
            <p>Estado: {task.status}</p>
            <button onClick={() => handleEditTask(task._id)}>Editar tarea</button> {/* Botón para editar */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

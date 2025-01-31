import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/TaskList.css';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Baja',
  });
  const [error, setError] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const navigate = useNavigate();

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
      fetchTasks();
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Baja' });
    } catch (error) {
      console.error('Error creando tarea:', error);
      setError('Error al crear la tarea.');
    }
  };

  const handleEditTask = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta tarea?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      setError('Error al eliminar la tarea.');
    }
  };

  const handleChangeStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Pendiente' ? 'Completada' : 'Pendiente';
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error cambiando estado de tarea:', error);
      setError('Error al cambiar el estado de la tarea.');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const filterByPriority = priorityFilter === 'Todos' || task.priority === priorityFilter;
    const filterByStatus = statusFilter === 'Todos' || task.status === statusFilter;
    return filterByPriority && filterByStatus;
  });

  useEffect(() => {
    fetchTasks();
  }, [token]);

  return (
    <div>
      <h2>Tareas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Crear nueva tarea</h3>
      <form onSubmit={handleCreateTask}>
        <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Título" required />
        <input type="text" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Descripción" required />
        <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} required />
        <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <button type="submit">Crear tarea</button>
      </form>

      <h3>Filtrar tareas</h3>
      <div>
        <label>
          Prioridad:
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </label>
        <label>
          Estado:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Completada">Completada</option>
          </select>
        </label>
      </div>

      <div>
        {filteredTasks.map((task) => (
          <div key={task._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Fecha de vencimiento: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Prioridad: {task.priority}</p>
            <p className={task.status === 'Pendiente' ? 'task-status-pendiente' : 'task-status-completada'}>
              Estado: {task.status}
            </p>
            <button onClick={() => handleEditTask(task._id)}>Editar tarea</button>
            <button onClick={() => handleDeleteTask(task._id)} style={{ marginLeft: '10px', color: 'red' }}>Eliminar tarea</button>
            <button
              onClick={() => handleChangeStatus(task._id, task.status)}
              style={{ marginLeft: '10px', color: 'blue' }}
            >
              Cambiar estado a {task.status === 'Pendiente' ? 'Completada' : 'Pendiente'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

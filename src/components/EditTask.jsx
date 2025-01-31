import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTask = ({ token }) => {
  const { id } = useParams(); // Obtener el ID de la tarea desde la URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null); // Estado para almacenar los detalles de la tarea
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Obtener los detalles de la tarea
  const fetchTaskDetails = async () => {
    if (!token) {
      setError('Token no válido. Por favor, inicia sesión.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(response.data); // Guardar los detalles de la tarea
    } catch (error) {
      setError('Error al obtener los detalles de la tarea.');
      console.error(error);
    } finally {
      setIsLoading(false); // Detener el indicador de carga
    }
  };

  // Actualizar la tarea
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!task.title || !task.description || !task.dueDate || !task.priority) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Tarea actualizada correctamente.');
      navigate('/tasks'); 
    } catch (error) {
      setError('Error al actualizar la tarea. Por favor, inténtalo de nuevo.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  // Mientras se cargan los datos
  if (isLoading) {
    return <p>Cargando...</p>;
  }

  // Mostrar errores si los hay
  if (error) {
    return <div>
      <p>{error}</p>
      <button onClick={() => navigate('/tasks')}>Volver a la lista de tareas</button>
    </div>;
  }


  if (!task) {
    return <p>No se pudo cargar la tarea.</p>;
  }


  return (
    <div>
      <h2>Editar Tarea</h2>
      <form onSubmit={handleUpdateTask}>
        <label>
          Título:
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            placeholder="Título"
            required
          />
        </label>
        <label>
          Descripción:
          <input
            type="text"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            placeholder="Descripción"
            required
          />
        </label>
        <label>
          Fecha de vencimiento:
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            required
          />
        </label>
        <label>
          Prioridad:
          <select
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
            required
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </label>
        <button type="submit">Actualizar tarea</button>
      </form>
      <button onClick={() => navigate('/')}>Cancelar</button>
    </div>
  );
};

export default EditTask;

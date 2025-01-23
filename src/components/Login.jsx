import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Función para manejar el login
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      // Guardar el token recibido
      localStorage.setItem('token', response.data.token); // Guardar el token en el localStorage
      setToken(response.data.token); // Establecer el token en el estado
      window.location.href = '/tasks'; // Redirigir al usuario a la página de tareas
    } catch (error) {
      console.error('Error al hacer login:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" onClick={handleLogin}>Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;

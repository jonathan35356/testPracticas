import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Función para manejar el registro
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
      });
      console.log('Usuario registrado:', response.data);
      // Aquí puedes hacer algo después del registro, como redirigir al login
    } catch (error) {
      console.error('Error al registrar usuario:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
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
        <button type="submit" onClick={handleRegister}>Registrar</button>
      </form>
    </div>
  );
};

export default Register;

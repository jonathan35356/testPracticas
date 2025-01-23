import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Recupera el token desde el almacenamiento local

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/tasks" element={<TaskList token={token} />} />
        <Route path="/tasks/new" element={<TaskForm />} />
      </Routes>
    </Router>
  );
};

export default App;

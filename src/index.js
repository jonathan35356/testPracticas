import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());




const JWT_SECRET = 'secretkey'; // Definimos la clave secreta en una constante

const url = 'mongodb://localhost:27017/task_manager'; // Cambia el nombre de la base de datos según lo que uses

mongoose.connect(url)
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err);
  });

// Modelos
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: { type: String, enum: ['Alta', 'Media', 'Baja'] },
  status: { type: String, enum: ['Pendiente', 'Completada'], default: 'Pendiente' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);

// Rutas de autenticación
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'El correo ya está registrado' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Usuario no encontrado' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  // Generar el token JWT usando la clave secreta
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar el token usando la clave secreta
    const verified = jwt.verify(token, JWT_SECRET);
    req.userId = verified.userId; // Corregido para usar "userId"
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Rutas CRUD para tareas
app.post('/tasks', authMiddleware, async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  try {
    const task = new Task({ title, description, dueDate, priority, userId: req.userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear tarea' });
  }
});

app.get('/tasks', authMiddleware, async (req, res) => {
  const { priority, status } = req.query;
  const filter = { userId: req.userId };

  if (priority) filter.priority = priority;
  if (status) filter.status = status;

  try {
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener tareas' });
  }
});

app.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar tarea' });
  }
});

app.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar tarea' });
  }
});

// Iniciar servidor
app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});

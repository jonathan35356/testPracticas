import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
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
};

export const createTask = async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  try {
    const task = new Task({ title, description, dueDate, priority, userId: req.userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear tarea' });
  }
};

import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Grid, Typography, Paper, Snackbar } from '@mui/material';
import { Add, Edit, Delete, Alarm } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchTasks = () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  };

  const handleTaskSubmit = () => {
    const newTask = {
      id: isEditing ? currentTaskId : uuidv4(),
      taskName,
      dueDate,
      priority,
      completed: false,
    };

    let updatedTasks;
    if (isEditing) {
      updatedTasks = tasks.map(task => (task.id === currentTaskId ? newTask : task));
    } else {
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setIsEditing(false);
    setCurrentTaskId(null);
    resetForm();
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleEditTask = (task) => {
    setTaskName(task.taskName);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setIsEditing(true);
    setCurrentTaskId(task.id);
  };

  const resetForm = () => {
    setTaskName('');
    setDueDate('');
    setPriority('Medium');
  };

  const handleReminder = (task) => {
    const now = new Date();
    const taskDueDate = new Date(task.dueDate);
    if (taskDueDate - now <= 3600000) {
      alert(`Reminder: Task "${task.taskName}" is due in less than an hour!`);
    }
  };

  const categorizeTasks = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Container>
      <Typography variant="h3" gutterBottom align="center">AI-Powered Todo List</Typography>
      <Paper sx={{ padding: 3 }}>
        <TextField label="Task Name" fullWidth variant="outlined" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
        <TextField label="Due Date" type="datetime-local" fullWidth variant="outlined" value={dueDate} onChange={(e) => setDueDate(e.target.value)} sx={{ marginTop: 2 }} />
        <TextField label="Priority" select fullWidth value={priority} onChange={(e) => setPriority(e.target.value)} sx={{ marginTop: 2 }}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </TextField>
        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 3 }} onClick={handleTaskSubmit}>
          {isEditing ? 'Edit Task' : 'Add Task'}
        </Button>
      </Paper>
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {['High', 'Medium', 'Low'].map((priorityLevel) => (
          <Grid item xs={12} md={4} key={priorityLevel}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">{priorityLevel} Priority</Typography>
              {categorizeTasks(priorityLevel).map((task) => (
                <Paper key={task.id} sx={{ margin: 1, padding: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Typography>{task.taskName}</Typography>
                    <Typography variant="caption" color="textSecondary">{task.dueDate}</Typography>
                  </div>
                  <div>
                    <Button onClick={() => handleReminder(task)}>
                      <Alarm />
                    </Button>
                    <Button onClick={() => handleEditTask(task)}>
                      <Edit />
                    </Button>
                    <Button onClick={() => deleteTask(task.id)}>
                      <Delete />
                    </Button>
                  </div>
                </Paper>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message="Task added successfully!" />
    </Container>
  );
};

export default App;

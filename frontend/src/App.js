import { useEffect, useState } from 'react';
import { fetchTasks } from './services/api';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setTasks([]);
      }
    };
    loadTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  const handleToggleComplete = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedTask = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      console.error(err);
      alert('Failed to update task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return false;
  });

  return (
    <div className="app-container">
      <h1 className="app-heading">Task Manager</h1>
      <p className="app-subheading">Manage your tasks efficiently</p>

      <TaskForm
        initialTask={taskBeingEdited}
        onTaskAdded={(task) => setTasks(prev => [...prev, task])}
        onTaskUpdated={(updatedTask) => {
          setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
          setTaskBeingEdited(null);
  }}
/>


      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'selected' : ''}>All</button>
        <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'selected' : ''}>Pending</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'selected' : ''}>Completed</button>
      </div>

      <TaskList
        tasks={filteredTasks}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
        onEdit={(task) => setTaskBeingEdited(task)}
      />
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';
import './TaskForm.css';

function TaskForm({ onTaskAdded, onTaskUpdated, initialTask }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(initialTask?.description || '');
    const [dueDate, setDueDate] = useState('');

useEffect(() => {
  if (initialTask) {
    setTitle(initialTask.title);
    setDueDate(initialTask.dueDate);
    setDescription(initialTask.description || '');
  } else {
    setTitle('');
    setDueDate('');
    setDescription('');
  }
}, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !dueDate) return;

    const taskData = { title: title.trim(), dueDate, description: description.trim() };

    try {
      if (initialTask) {
        const res = await fetch(`http://localhost:5000/tasks/${initialTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Failed to update task');
          return;
        }

        const updatedTask = await res.json();
        onTaskUpdated(updatedTask);
      } else {
        const res = await fetch('http://localhost:5000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Failed to create task');
          return;
        }

        const createdTask = await res.json();
        onTaskAdded(createdTask);
      }

      setTitle('');
      setDueDate('');
    } catch (err) {
      console.error('Error submitting task:', err);
      alert('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
          />
     <input
        type="text"
        placeholder="Task description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
    />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <button type="submit">{initialTask ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
}

export default TaskForm;
import { useState, useEffect } from 'react';
import './TaskForm.css';

function TaskForm({ onTaskAdded, onTaskUpdated, initialTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !dueDate) return;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
    };

    try {
      if (initialTask) {
        // Update task
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
        // Create task
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
      setDescription('');
      setDueDate('');
    } catch (err) {
      console.error('Error submitting task:', err);
      alert('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <label>Task Name</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Due Date</label>
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
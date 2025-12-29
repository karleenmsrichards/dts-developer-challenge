import './TaskList.css';

function TaskList({ tasks, onDelete, onEdit, onToggleComplete }) {
  if (!tasks.length) {
    return <p>No tasks yet</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`task-item ${task.completed ? 'completed' : ''}`}
          >
          <span className={`task-title ${task.completed ? 'completed' : ''}`}>
            {task.title} — due {task.dueDate}
          </span>
          {task.description && <p className="task-description">{task.description}</p>}
          <div className="task-buttons">
            <button onClick={() => onToggleComplete(task.id)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => onEdit(task)}>Edit</button>
            <button
              onClick={() => onDelete(task.id)}
              className="delete"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
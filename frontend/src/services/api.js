const API_BASE_URL = 'http://localhost:5000';

export async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    return []; 
  }
}

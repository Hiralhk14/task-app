const BASE_URL = 'https://dummyjson.com/todos';

export async function fetchTasks(limit, page) {
  const skip = (page - 1) * limit;
  const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
}

export async function fetchTaskById(taskId) {
  const response = await fetch(`${BASE_URL}/${taskId}`);
  if (!response.ok) throw new Error('Failed to fetch task');
  return response.json();
}

export async function addTask(taskData) {
  const taskPayload = {
    todo: taskData?.todo || taskData,
    completed: taskData?.completed || false,
    userId: taskData?.userId || 1,
  };

  const response = await fetch(BASE_URL + '/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskPayload),
  });
    
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Add Task Error:', errorText);
    throw new Error(`Failed to add task: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}
  
export async function updateTask(id, todo, completed) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todo, completed }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.status}`);
  }
  
  return response.json();
}
  
export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.status}`);
  }
  
  return response.json();
}
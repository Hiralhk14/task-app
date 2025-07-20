import React, { useState, useEffect } from 'react';
import { X } from "lucide-react";
import { toast } from 'react-toastify';

export default function TaskModal({ open, onClose, task, onEdit, onDelete, onTaskUpdated, onTaskAdded, isAddMode = false }) {
  const [editMode, setEditMode] = useState(false);
  const [todo, setTodo] = useState(task?.todo || '');
  const [completed, setCompleted] = useState(task?.completed || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAddMode) {
      setTodo('');
      setCompleted(false);
      setEditMode(true);
    } else {
      setTodo(task?.todo || '');
      setCompleted(task?.completed || false);
      setEditMode(false);
    }
  }, [task, isAddMode]);

  if (!open) return null;

  const handleSave = async () => {
    if (!todo.trim()) {
      alert('Please enter a task name');
      return;
    }

    setLoading(true);
    try {
      if (isAddMode) {
        // Add new task
        const res = await fetch('https://dummyjson.com/todos/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            todo: todo.trim(),
            completed: false, // Default status is pending
            userId: 5, // Default user ID
          })
        });
        const newTask = await res.json();
        onTaskAdded?.(newTask);
        onClose?.();
      } else {
        // Update existing task
        const res = await fetch(`https://dummyjson.com/todos/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todo, completed }),
        });
        const updated = await res.json();
        onTaskUpdated?.(updated);
        setEditMode(false);
      }
    } catch (e) {
      toast.error('Failed to save task');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!task?.id) {
      alert('Task ID not found');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://dummyjson.com/todos/${task.id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        const result = await res.json();
        console.log('Task deleted:', result);
        
        // Check if the task was marked as deleted
        if (result.isDeleted) {
          onDelete?.(task?.id);
          onClose?.();
        } else {
          throw new Error('Task was not deleted');
        }
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (e) {
      toast.error('Failed to delete task');
      console.error('Delete error:', e);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {isAddMode ? 'Add New Task' : 'Task Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        {isAddMode ? (
          // Add mode - only show task name input
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Task Name</label>
              <textarea
                className="w-full border rounded p-2"
                value={todo}
                onChange={e => setTodo(e?.target?.value)}
                rows={3}
                placeholder="Enter task name..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="border px-4 py-2 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </>
        ) : editMode ? (
          // Edit mode for existing tasks
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Task</label>
              <textarea
                className="w-full border rounded p-2"
                value={todo}
                onChange={e => setTodo(e?.target?.value)}
                rows={2}
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="completed"
                checked={completed}
                onChange={e => setCompleted(e?.target?.checked)}
                className="mr-2"
              />
              <label htmlFor="completed" className="font-medium">Completed</label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditMode(false)}
                className="border px-4 py-2 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        ) : (
          // View mode for existing tasks
          <>
            <div className="mb-2"><strong>Name:</strong> {task?.todo}</div>
            <div className="mb-2"><strong>Status:</strong> {task?.completed ? 'Completed' : 'Pending'}</div>
            <div className="mb-2"><strong>ID:</strong> {task?.id}</div>
            <div className="mb-4"><strong>User ID:</strong> {task?.userId}</div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 
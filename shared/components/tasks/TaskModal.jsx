import React, { useState, useEffect } from 'react';
import { X } from "lucide-react";
import { toast } from 'react-toastify';

import TaskDetails from './taskDetails';
import TaskForm from './addTaskFrom';
import { addTask, deleteTask, updateTask } from '@/api/tasks/tasksApi';

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
      toast.error('Please enter a task name');
      return;
    }

    setLoading(true);
    try {
      if (isAddMode) {
        const taskData = {
          todo: todo.trim(),
          completed: completed,
          userId: 1
        };
        
        const newTask = await addTask(taskData);
        onTaskAdded?.(newTask);
        toast.success('Task added successfully!', {
          toastId: `add-task-${Date.now()}`,
        });
        onClose?.();
      } else {
        const updated = await updateTask(task?.id, todo.trim(), completed);        
        onTaskUpdated?.(updated);
        toast.success('Task updated successfully!', {
          toastId: `update-task-${task?.id}`,
        });
        setEditMode(false);
      }
    } catch (error) {
      console.error('Save task error:', error);
      toast.error(error.message || 'Failed to save task', {
        toastId: `error-save-${Date.now()}`,
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!task?.id) {
      toast.error('Task ID not found');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteTask(task.id);
      
      if (result?.isDeleted) {
        onDelete?.(task?.id);
        toast.success('Task deleted successfully!', {
          toastId: `delete-task-${task.id}`, 
        });
        onClose?.();
      } else {
        throw new Error('Task was not deleted');
      }
    } catch (error) {
      console.error('Delete task error:', error);
      toast.error(error.message || 'Failed to delete task', {
        toastId: `error-delete-${Date.now()}`,
      });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {isAddMode ? 'Add New Task' : editMode ? 'Edit Task' : 'Task Details'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none" aria-label="Close">
            <X size={24} />
          </button>
        </div>
        {isAddMode || editMode ? (
          <TaskForm
            todo={todo}
            setTodo={setTodo}
            completed={completed}
            setCompleted={setCompleted}
            loading={loading}
            isAddMode={isAddMode}
            onSave={handleSave}
            onCancel={() => {
              if (isAddMode) onClose();
              else setEditMode(false);
            }}
          />
        ) : (
          <TaskDetails
            task={task}
            onEdit={() => setEditMode(true)}
            onDelete={handleDelete}
            loading={loading}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
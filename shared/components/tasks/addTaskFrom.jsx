import React from 'react';
import PropTypes from 'prop-types';

export default function TaskForm({
  todo, setTodo, completed, setCompleted, loading,
  isAddMode, onSave, onCancel
}) {
  return (
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
      {!isAddMode && (
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
      )}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="border px-4 py-2 rounded" disabled={loading}>Cancel</button>
        <button onClick={onSave} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? (isAddMode ? 'Adding...' : 'Saving...') : (isAddMode ? 'Add Task' : 'Save')}
        </button>
      </div>
    </>
  );
}

TaskForm.propTypes = {
  todo: PropTypes.string,
  setTodo: PropTypes.func,
  completed: PropTypes.bool,
  setCompleted: PropTypes.func,
  loading: PropTypes.bool,
  isAddMode: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};
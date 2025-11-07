import React from 'react';
import PropTypes from 'prop-types';

export default function TaskDetails({ task, onEdit, onDelete, loading }) {
  return (
    <>
      <div className="mb-2"><strong>Name:</strong> {task?.todo}</div>
      <div className="mb-2"><strong>Status:</strong> {task?.completed ? 'Completed' : 'Pending'}</div>
      <div className="mb-2"><strong>ID:</strong> {task?.id}</div>
      <div className="mb-4"><strong>User ID:</strong> {task?.userId}</div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onEdit}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </>
  );
}

TaskDetails.propTypes = {
  task: PropTypes.shape({
    todo: PropTypes.string,
    completed: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}; 

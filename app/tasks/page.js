'use client';

import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import TaskModal from '@/shared/components/tasks/TaskModal';
import { fetchTasks, fetchTaskById } from '@/api/tasks/tasksApi';
import Pagination from '@/shared/components/common/Pagination';
import { RefreshCw, ShoppingBag } from 'lucide-react';
import Loader from '@/shared/components/common/Loader';

export default function TasksPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [limit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router?.push('/');
    }
  }, [isAuthenticated, router]);

  const fetchTasksHandler = async (page = 1) => {
    try {
      setLoading(true);
      const data = await fetchTasks(limit, page);
      setTasks(data?.todos || []);
      setTotalTasks(data?.total || 0);
      setTotalPages(Math?.ceil((data?.total || 0) / limit));
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasksHandler(1);
    }
  }, [isAuthenticated]);


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchTasksHandler(page);
    }
  };

  const handleLogout = () => {
    logout();
    router?.push('/');
  };

  const handleTaskClick = useCallback(async (taskId) => {
    try {
      const data = await fetchTaskById(taskId);
      setSelectedTask(data);
      setModalOpen(true);
    } catch (error) {
      toast.error('Failed to load task details');
    }
  }, []);

  const handleAddNewTask = () => {
    setIsAddMode(true);
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setTotalTasks(prev => prev + 1);
    toast?.success('Task added successfully!');
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setIsAddMode(false);
  };

  const handleEdit = () => {
    toast?.info('Failed to update.');
  };

  const handleDelete = (taskId) => {
    setTasks(prev => prev?.filter(task => task?.id !== taskId));
    setTotalTasks(prev => prev - 1);
    toast?.success('Task deleted successfully!');
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev =>
      prev?.map(t => (t?.id === updatedTask?.id ? { ...t, ...updatedTask } : t))
    );
    setSelectedTask(updatedTask);
    toast?.success('Task updated!');
  };

  if (!isAuthenticated) {
    return null;
  }

  const handleViewProducts = () => {
    router?.push('/products');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome, {user?.firstName || 'User'}!
                </h1>
                <p className="text-gray-600">
                  Manage your tasks
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Total Tasks: {totalTasks} | Page {currentPage} of {totalPages}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchTasksHandler(currentPage)}
                  className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  onClick={handleViewProducts}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-500 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                >
                  <ShoppingBag size={18} />
                  View Product List
                </button>
                <button
                  onClick={handleAddNewTask}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                >
                  + Add New Task
                </button>
              </div>
            </div>
            {loading && (
              <Loader/>
            )}

            {!loading && (
              <>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-sm font-semibold text-gray-700 w-16">
                        ID
                      </span>
                      <span className="text-sm font-semibold text-gray-700 flex-1">
                        Description
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-700 w-24 text-center">
                        Status
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {tasks?.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No tasks found</p>
                    </div>
                  ) : (
                    tasks?.map((task) => (
                      <div
                        key={task?.id}
                        className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="text-sm text-gray-600 font-medium w-16">
                            {task?.id}
                          </span>
                          <span className="text-gray-900 flex-1">
                            {task?.todo}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium w-24 text-center ${task?.completed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {task?.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              </>
            )}
          </div>
        </div>
      </div>
      <TaskModal
        open={modalOpen}
        onClose={handleModalClose}
        task={selectedTask}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTaskUpdated={handleTaskUpdated}
        onTaskAdded={handleTaskAdded}
        isAddMode={isAddMode}
      />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Check, Sparkles, TrendingUp, Target, Database } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import DataManager from '../components/DataManager';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('all');
    const [showDataManager, setShowDataManager] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/task/gp', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/task/gp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                const newTask = await response.json();
                setTasks([newTask, ...tasks]);
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleUpdateTask = async (taskId, taskData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/task/gp/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                const updatedTask = await response.json();
                setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
                setEditingTask(null);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:4000/api/task/gp/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setTasks(tasks.filter(task => task._id !== taskId));
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleToggleComplete = async (taskId, completed) => {
        await handleUpdateTask(taskId, { completed: !completed });
    };

    const handleImportTasks = async (importedTasks) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/task/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ tasks: importedTasks }),
            });

            if (response.ok) {
                const result = await response.json();
                setTasks([...result.tasks, ...tasks]);
                alert(`Successfully imported ${result.tasks.length} tasks!`);
            } else {
                throw new Error('Failed to import tasks');
            }
        } catch (error) {
            console.error('Error importing tasks:', error);
            alert('Error importing tasks. Please try again.');
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length,
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
                        <Sparkles className="h-8 w-8 text-white animate-spin" />
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your tasks...</h3>
                    <p className="text-gray-600">Getting everything ready for you ✨</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Modern Header with Gradient - Responsive */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-white/5 rounded-full -translate-y-24 translate-x-24 sm:-translate-y-48 sm:translate-x-48"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/5 rounded-full translate-y-16 -translate-x-16 sm:translate-y-32 sm:-translate-x-32"></div>
                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 animate-pulse" />
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                My Tasks
                            </h1>
                        </div>
                        <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Stay organized and achieve your goals ✨</p>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                        <button
                            onClick={() => setShowDataManager(true)}
                            className="group relative bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg flex-1 sm:flex-none"
                        >
                            <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
                                <Database className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="font-medium text-sm sm:text-base">Data</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="group relative bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl flex-1 sm:flex-none"
                        >
                            <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300" />
                                <span className="font-semibold text-sm sm:text-base">Add Task</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modern Stats Cards - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Total Tasks</p>
                            <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats.total}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-blue-500 rounded-xl sm:rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-3 sm:mt-4 flex items-center text-blue-600">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs sm:text-sm">Your productivity hub</span>
                    </div>
                </div>

                <div className="group relative bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-emerald-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-emerald-600 mb-1">Completed</p>
                            <p className="text-2xl sm:text-3xl font-bold text-emerald-900">{stats.completed}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-emerald-500 rounded-xl sm:rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                            <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-3 sm:mt-4 flex items-center text-emerald-600">
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs sm:text-sm">Great progress!</span>
                    </div>
                </div>

                <div className="group relative bg-gradient-to-br from-amber-50 to-orange-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-amber-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-amber-600 mb-1">Pending</p>
                            <p className="text-2xl sm:text-3xl font-bold text-amber-900">{stats.pending}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-amber-500 rounded-xl sm:rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-3 sm:mt-4 flex items-center text-amber-600">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs sm:text-sm">Keep going!</span>
                    </div>
                </div>
            </div>

            {/* Modern Filter Tabs - Responsive */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 p-1 bg-gray-100 rounded-xl sm:rounded-2xl w-full sm:w-fit">
                {[
                    { key: 'all', label: 'All Tasks', icon: Target },
                    { key: 'pending', label: 'Pending', icon: Clock },
                    { key: 'completed', label: 'Completed', icon: Check }
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex-1 sm:flex-none ${filter === key
                            ? 'bg-white text-blue-600 shadow-lg scale-105'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                            }`}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm sm:text-base">{label}</span>
                    </button>
                ))}
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-16">
                    <div className="relative mx-auto w-24 h-24 mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl opacity-20 animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl p-6 flex items-center justify-center">
                            <Calendar className="h-12 w-12 text-blue-500" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {filter === 'all' ? '🎯 Ready to get productive?' : `No ${filter} tasks yet`}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                        {filter === 'all' ? 'Create your first task and start your journey!' : `You have no ${filter} tasks at the moment.`}
                    </p>
                    {filter === 'all' && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                        >
                            <Plus className="h-5 w-5" />
                            <span className="font-semibold">Create Your First Task</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredTasks.map(task => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={() => setEditingTask(task)}
                            onDelete={() => handleDeleteTask(task._id)}
                            onToggleComplete={() => handleToggleComplete(task._id, task.completed)}
                        />
                    ))}
                </div>
            )}

            {(showForm || editingTask) && (
                <TaskForm
                    task={editingTask}
                    onSubmit={editingTask ?
                        (data) => handleUpdateTask(editingTask._id, data) :
                        handleCreateTask
                    }
                    onClose={() => {
                        setShowForm(false);
                        setEditingTask(null);
                    }}
                />
            )}

            {showDataManager && (
                <DataManager
                    tasks={tasks}
                    onClose={() => setShowDataManager(false)}
                    onImport={handleImportTasks}
                    onRefresh={fetchTasks}
                />
            )}
        </div>
    );
};

export default Dashboard;
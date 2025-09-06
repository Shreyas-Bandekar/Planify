import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Check, Sparkles, TrendingUp, Target } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('all');

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
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Modern Header with Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
                <div className="relative flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                My Tasks
                            </h1>
                        </div>
                        <p className="text-blue-100 text-lg">Stay organized and achieve your goals ✨</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="group relative bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        <div className="flex items-center space-x-2">
                            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="font-semibold">Add Task</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Modern Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Total Tasks</p>
                            <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-blue-500 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-blue-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">Your productivity hub</span>
                    </div>
                </div>

                <div className="group relative bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border border-emerald-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-600 mb-1">Completed</p>
                            <p className="text-3xl font-bold text-emerald-900">{stats.completed}</p>
                        </div>
                        <div className="p-3 bg-emerald-500 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                            <Check className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-emerald-600">
                        <Sparkles className="h-4 w-4 mr-1" />
                        <span className="text-sm">Great progress!</span>
                    </div>
                </div>

                <div className="group relative bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-2xl border border-amber-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-amber-600 mb-1">Pending</p>
                            <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
                        </div>
                        <div className="p-3 bg-amber-500 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                            <Clock className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-amber-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">Keep going!</span>
                    </div>
                </div>
            </div>

            {/* Modern Filter Tabs */}
            <div className="flex space-x-2 p-1 bg-gray-100 rounded-2xl w-fit">
                {[
                    { key: 'all', label: 'All Tasks', icon: Target },
                    { key: 'pending', label: 'Pending', icon: Clock },
                    { key: 'completed', label: 'Completed', icon: Check }
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${filter === key
                            ? 'bg-white text-blue-600 shadow-lg scale-105'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                            }`}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-600">
                        {filter === 'all' ? 'Create your first task to get started!' : `No ${filter} tasks.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
    );
};

export default Dashboard;
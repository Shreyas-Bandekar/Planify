import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Check, ArrowLeft, Share2, AlertCircle } from 'lucide-react';

const SharedTasks = () => {
  const { shareId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    loadSharedTasks();
  }, [shareId]);

  const loadSharedTasks = () => {
    try {
      // Decode the shared data
      const decoded = atob(shareId);
      const data = JSON.parse(decoded);
      
      setShareData(data);
      setTasks(data.tasks || []);
      setLoading(false);
    } catch (err) {
      setError('Invalid or corrupted share link');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const priorityConfig = {
    low: { colors: 'bg-green-100 text-green-800 border-green-200', icon: '🌱' },
    medium: { colors: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⚡' },
    high: { colors: 'bg-red-100 text-red-800 border-red-200', icon: '🔥' }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow mx-auto">
            <Share2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading shared tasks...</h3>
          <p className="text-gray-600">Please wait while we load the content ✨</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Tasks</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Planify</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Planify</span>
          </Link>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Shared Tasks
                </h1>
                <p className="text-gray-600">
                  Shared on {shareData && formatDate(shareData.sharedAt)} • Read-only view
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-2xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.completed}</p>
              </div>
              <div className="p-3 bg-emerald-500 rounded-2xl">
                <Check className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-500 rounded-2xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl p-6 flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No tasks shared</h3>
            <p className="text-gray-600 text-lg">This shared link doesn't contain any tasks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task, index) => {
              const priority = priorityConfig[task.priority];
              const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
              
              return (
                <div
                  key={index}
                  className={`bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    task.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {task.completed && <Check className="w-3 h-3" />}
                      </div>
                      
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${priority.colors}`}>
                        <span>{priority.icon}</span>
                        <span className="capitalize">{task.priority}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className={`font-bold text-gray-900 mb-3 text-lg leading-tight ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}>
                    {task.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                    
                    {isOverdue && (
                      <div className="flex items-center space-x-1 text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-semibold">Overdue</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <p className="text-gray-600 mb-4">
              Want to create and manage your own tasks?
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105"
            >
              <span>✨ Try Planify</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedTasks;
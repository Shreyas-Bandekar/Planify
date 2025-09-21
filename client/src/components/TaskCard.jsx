import { Calendar, Clock, Edit, Trash2, Check, AlertCircle, Flame, Zap, Leaf } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  const priorityConfig = {
    low: {
      colors: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200',
      icon: Leaf,
      glow: 'shadow-emerald-200/50'
    },
    medium: {
      colors: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200',
      icon: Zap,
      glow: 'shadow-amber-200/50'
    },
    high: {
      colors: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200',
      icon: Flame,
      glow: 'shadow-red-200/50'
    }
  };

  const priority = priorityConfig[task.priority];
  const PriorityIcon = priority.icon;

  return (
    <div className={`group relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 p-4 sm:p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ${task.completed ? 'opacity-75 hover:opacity-90' : ''
      } ${priority.glow} hover:shadow-xl`}>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-xl sm:rounded-2xl"></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <button
              onClick={onToggleComplete}
              className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0 ${task.completed
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : 'border-gray-300 hover:border-emerald-500 hover:shadow-md'
                }`}
            >
              {task.completed && <Check className="w-2 h-2 sm:w-3 sm:h-3" />}
              {!task.completed && (
                <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>

            <div className={`flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold border ${priority.colors} flex-shrink-0`}>
              <PriorityIcon className="w-2 h-2 sm:w-3 sm:h-3" />
              <span className="capitalize hidden sm:inline">{task.priority}</span>
              <span className="capitalize sm:hidden">{task.priority.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <h3 className={`font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg leading-tight ${task.completed ? 'line-through text-gray-500' : ''
          }`}>
          {task.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-lg">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{formatDate(task.dueDate)}</span>
            </div>
          </div>

          {isOverdue && (
            <div className="flex items-center space-x-1 text-red-500 bg-red-50 px-2 py-1 rounded-lg animate-pulse">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs font-semibold">Overdue</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
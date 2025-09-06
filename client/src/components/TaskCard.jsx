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
    <div className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ${
      task.completed ? 'opacity-75 hover:opacity-90' : ''
    } ${priority.glow} hover:shadow-xl`}>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl"></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleComplete}
              className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                task.completed
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : 'border-gray-300 hover:border-emerald-500 hover:shadow-md'
              }`}
            >
              {task.completed && <Check className="w-3 h-3" />}
              {!task.completed && (
                <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>
            
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${priority.colors}`}>
              <PriorityIcon className="w-3 h-3" />
              <span className="capitalize">{task.priority}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
            <div className="flex items-center space-x-1 text-red-500 bg-red-50 px-2 py-1 rounded-lg animate-pulse">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">Overdue</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
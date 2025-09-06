import { Calendar, Clock, Edit, Trash2, Check, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleComplete}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {task.completed && <Check className="w-3 h-3" />}
          </button>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            priorityColors[task.priority]
          }`}>
            {task.priority}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className={`font-semibold text-gray-900 mb-2 ${
        task.completed ? 'line-through' : ''
      }`}>
        {task.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        
        {isOverdue && (
          <div className="flex items-center space-x-1 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span>Overdue</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
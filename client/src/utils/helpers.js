/**
 * Utility functions for Planify Task Manager
 */

/**
 * Format date to readable string
 * @param {string|Date} dateString - Date to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    const defaultOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        ...options,
    };
    
    try {
        return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid Date';
    }
};

/**
 * Check if a task is overdue
 * @param {string} dueDate - Task due date
 * @param {boolean} completed - Task completion status
 * @returns {boolean} - Whether task is overdue
 */
export const isTaskOverdue = (dueDate, completed = false) => {
    if (completed) return false;
    return new Date(dueDate) < new Date();
};

/**
 * Get days until due date
 * @param {string} dueDate - Task due date
 * @returns {number} - Days until due (negative if overdue)
 */
export const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Generate a random ID
 * @param {number} length - ID length
 * @returns {string} - Random ID
 */
export const generateId = (length = 8) => {
    return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};

/**
 * Download data as file
 * @param {string} data - Data to download
 * @param {string} filename - File name
 * @param {string} type - MIME type
 */
export const downloadFile = (data, filename, type = 'text/plain') => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with score and feedback
 */
export const validatePassword = (password) => {
    const result = {
        isValid: false,
        score: 0,
        feedback: [],
    };

    if (password.length < 8) {
        result.feedback.push('Password must be at least 8 characters long');
    } else {
        result.score += 1;
    }

    if (!/[a-z]/.test(password)) {
        result.feedback.push('Password must contain at least one lowercase letter');
    } else {
        result.score += 1;
    }

    if (!/[A-Z]/.test(password)) {
        result.feedback.push('Password must contain at least one uppercase letter');
    } else {
        result.score += 1;
    }

    if (!/\d/.test(password)) {
        result.feedback.push('Password must contain at least one number');
    } else {
        result.score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        result.feedback.push('Password must contain at least one special character');
    } else {
        result.score += 1;
    }

    result.isValid = result.score >= 3;
    return result;
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get task statistics
 * @param {Array} tasks - Array of tasks
 * @returns {object} - Task statistics
 */
export const getTaskStats = (tasks = []) => {
    const stats = {
        total: tasks.length,
        completed: 0,
        pending: 0,
        overdue: 0,
        byPriority: {
            low: 0,
            medium: 0,
            high: 0,
        },
    };

    tasks.forEach(task => {
        if (task.completed) {
            stats.completed++;
        } else {
            stats.pending++;
            if (isTaskOverdue(task.dueDate)) {
                stats.overdue++;
            }
        }
        
        if (stats.byPriority.hasOwnProperty(task.priority)) {
            stats.byPriority[task.priority]++;
        }
    });

    return stats;
};
import { useState } from 'react';
import { Download, Upload, Share2, Database, FileText, File, X, Copy, Check } from 'lucide-react';

const DataManager = ({ tasks, onClose, onImport, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [importing, setImporting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Title', 'Description', 'Priority', 'Due Date', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...tasks.map(task => [
        `"${task.title.replace(/"/g, '""')}"`,
        `"${task.description.replace(/"/g, '""')}"`,
        task.priority,
        new Date(task.dueDate).toLocaleDateString(),
        task.completed ? 'Completed' : 'Pending',
        new Date(task.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `planify-tasks-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF (using browser print)
  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Planify Tasks Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .task { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; }
            .task-title { font-weight: bold; font-size: 18px; margin-bottom: 10px; }
            .task-meta { color: #666; font-size: 14px; margin: 5px 0; }
            .priority-high { border-left: 4px solid #ef4444; }
            .priority-medium { border-left: 4px solid #f59e0b; }
            .priority-low { border-left: 4px solid #10b981; }
            .completed { opacity: 0.7; text-decoration: line-through; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📅 Planify Tasks Export</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>Total Tasks: ${tasks.length} | Completed: ${tasks.filter(t => t.completed).length} | Pending: ${tasks.filter(t => !t.completed).length}</p>
          </div>
          ${tasks.map(task => `
            <div class="task priority-${task.priority} ${task.completed ? 'completed' : ''}">
              <div class="task-title">${task.title}</div>
              <div class="task-meta">Description: ${task.description}</div>
              <div class="task-meta">Priority: ${task.priority.toUpperCase()}</div>
              <div class="task-meta">Due Date: ${new Date(task.dueDate).toLocaleDateString()}</div>
              <div class="task-meta">Status: ${task.completed ? '✅ Completed' : '⏳ Pending'}</div>
              <div class="task-meta">Created: ${new Date(task.createdAt).toLocaleDateString()}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Create backup
  const createBackup = () => {
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      tasks: tasks,
      metadata: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        pendingTasks: tasks.filter(t => !t.completed).length
      }
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `planify-backup-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file import
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let importedTasks = [];

        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          // JSON backup file
          const backup = JSON.parse(e.target.result);
          importedTasks = backup.tasks || backup;
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          // CSV file
          const lines = e.target.result.split('\n');
          const headers = lines[0].split(',');

          importedTasks = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',').map(val => val.replace(/"/g, '').trim());
            return {
              title: values[0] || 'Imported Task',
              description: values[1] || 'Imported from CSV',
              priority: values[2] || 'low',
              dueDate: new Date(values[3] || Date.now()).toISOString(),
              completed: values[4] === 'Completed'
            };
          });
        }

        if (importedTasks.length > 0) {
          onImport(importedTasks);
          setImporting(false);
          onClose();
        } else {
          throw new Error('No valid tasks found in file');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing file. Please check the file format.');
        setImporting(false);
      }
    };

    reader.readAsText(file);
  };

  // Generate shareable link
  const generateShareLink = () => {
    const shareData = {
      tasks: tasks.map(task => ({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        completed: task.completed
      })),
      sharedAt: new Date().toISOString()
    };

    // In a real app, you'd send this to your backend and get a share ID
    const encoded = btoa(JSON.stringify(shareData));
    const url = `${window.location.origin}/shared/${encoded}`;
    setShareUrl(url);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'export', label: 'Export', icon: Download },
    { id: 'import', label: 'Import', icon: Upload },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'share', label: 'Share', icon: Share2 }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">📊 Data Management</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">Export, import, backup and share your tasks</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0 ml-2"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-3 sm:px-6 font-medium transition-all duration-200 whitespace-nowrap ${activeTab === id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm sm:text-base">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-80 sm:max-h-96 overflow-y-auto">

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Your Tasks</h3>
                <p className="text-gray-600">Download your tasks in different formats</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={exportToCSV}
                  className="group p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-500 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-green-900">Export to CSV</h4>
                  </div>
                  <p className="text-green-700 text-sm">Download as spreadsheet file for Excel, Google Sheets</p>
                </button>

                <button
                  onClick={exportToPDF}
                  className="group p-6 bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl border border-red-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-red-500 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                      <File className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-red-900">Export to PDF</h4>
                  </div>
                  <p className="text-red-700 text-sm">Generate a formatted PDF document for printing</p>
                </button>
              </div>
            </div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Tasks</h3>
                <p className="text-gray-600">Upload CSV files or JSON backups</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {importing ? 'Importing...' : 'Choose File to Import'}
                </h4>
                <p className="text-gray-600 mb-4">Supports CSV and JSON files</p>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileImport}
                  disabled={importing}
                  className="hidden"
                  id="file-import"
                />
                <label
                  htmlFor="file-import"
                  className={`inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 cursor-pointer ${importing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{importing ? 'Importing...' : 'Select File'}</span>
                </label>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Backup & Restore</h3>
                <p className="text-gray-600">Create backups and restore your data</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Create Backup</h4>
                    <p className="text-blue-700 text-sm">Save all your tasks and settings</p>
                  </div>
                </div>
                <button
                  onClick={createBackup}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  📦 Create Backup File
                </button>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-amber-500 rounded-xl">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900">Restore from Backup</h4>
                    <p className="text-amber-700 text-sm">Upload a backup file to restore</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="backup-restore"
                />
                <label
                  htmlFor="backup-restore"
                  className="block w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition-colors duration-200 font-medium text-center cursor-pointer"
                >
                  🔄 Restore from Backup
                </label>
              </div>
            </div>
          )}

          {/* Share Tab */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Tasks</h3>
                <p className="text-gray-600">Generate a shareable link for your tasks</p>
              </div>

              {!shareUrl ? (
                <div className="text-center">
                  <button
                    onClick={generateShareLink}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:scale-105"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Generate Share Link</span>
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">🔗 Shareable Link Generated</h4>
                  <div className="flex items-center space-x-2 bg-white rounded-xl p-3 border">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                    />
                    <button
                      onClick={copyShareLink}
                      className={`p-2 rounded-lg transition-all duration-200 ${copied
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-green-700 text-sm mt-3">
                    Share this link with others to let them view your tasks (read-only)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataManager;
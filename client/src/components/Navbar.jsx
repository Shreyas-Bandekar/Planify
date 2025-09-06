import React from 'react';
import { LogOut, User, Sparkles } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent truncate">
                Planify
              </h1>
              <p className="text-xs text-gray-500 -mt-1 hidden sm:block">Task Management</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl border border-blue-100">
                <div className="relative">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border border-white"></div>
                </div>
                <div className="hidden lg:block">
                  <span className="text-gray-900 font-semibold text-sm">{user.name}</span>
                  <p className="text-gray-500 text-xs">Online</p>
                </div>
              </div>
              
              {/* Mobile user indicator */}
              <div className="sm:hidden relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              
              <button
                onClick={onLogout}
                className="group flex items-center space-x-1 sm:space-x-2 px-2 py-2 sm:px-4 sm:py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl sm:rounded-2xl transition-all duration-200 hover:scale-105"
              >
                <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                <span className="font-medium text-sm hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Settings, LogOut, User, ChevronDown } from 'lucide-react'

const Navbar = () => {
    const navigate = useNavigate();
    const menuref = React.useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuref.current && !menuref.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Default user object
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: null
    };
    
    const handleMenuToggle = () => {
        setMenuOpen(prev => !prev);
    };

    const handleLogout = () => {
        // Add logout logic here
        setMenuOpen(false)
        onLogout();
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100 transition-colors duration-300">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl mx-auto"> 
                {/* Left Side - Logo and Title */}
                <div 
                    className="flex items-center gap-3 sm:gap-4 cursor-pointer group" 
                    onClick={() => navigate('/')}
                >
                    <div className="relative p-2 sm:p-2.5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-3">
                        <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-sm" />
                        <div className="absolute inset-0 bg-white/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 transition-all duration-300">
                        Planify
                    </span>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Settings Button */}
                    <button 
                        className="group relative flex items-center justify-center p-2.5 sm:p-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        onClick={() => navigate('/profile')}
                        aria-label="Settings"
                    >
                        <Settings className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    {/* User Menu */}
                    <div className="relative" ref={menuref}>
                        <button 
                            onClick={handleMenuToggle}
                            className="group flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-emerald-500 hover:to-teal-500 text-gray-700 hover:text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            aria-label="User menu"
                        >
                            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-lg">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <span className="hidden sm:block text-sm font-medium truncate max-w-24">{user.name}</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                
                                <div className="py-2">
                                    <button 
                                        onClick={() => {navigate('/profile'); setMenuOpen(false);}}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                                    >
                                        <User className="h-4 w-4" />
                                        Profile Settings
                                    </button>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar

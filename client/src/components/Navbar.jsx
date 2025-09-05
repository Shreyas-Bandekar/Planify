import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Settings, LogOut, User } from 'lucide-react'

const Navbar = () => {
    const navigate = useNavigate();
    const menuref = React.useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Default user object - replace with actual user data from context/props
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: null
    };
    
    const handleMenuToggle = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        // Add logout logic here
        setMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100">
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
                        <Settings className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-90 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    {/* User Dropdown Menu */}
                    <div ref={menuref} className="relative">
                        <button 
                            onClick={handleMenuToggle} 
                            className="group relative flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-teal-50 border border-gray-200 hover:border-emerald-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <div className="relative">
                                {user.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt="Avatar" 
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-md ring-2 ring-white group-hover:ring-emerald-200 transition-all duration-300" 
                                    />
                                ) : (
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white group-hover:ring-emerald-200 transition-all duration-300">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-sm font-medium text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                                    {user.name}
                                </span>
                                <span className="text-xs text-gray-500 group-hover:text-emerald-600 transition-colors duration-300">
                                    {user.email}
                                </span>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 w-full text-left"
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
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
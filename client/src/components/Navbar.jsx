import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <header className='sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200'>
            <div className='flex items-center justify-between px-3 sm:px-6 lg:px-8 py-2 sm:py-3 max-w-7xl mx-auto'> 
                <div className='flex items-center gap-2 sm:gap-3 cursor-pointer group' 
                     onClick={() => navigate('/')}>
                    <div className='relative p-1.5 sm:p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                        <Zap className='h-5 w-5 sm:h-6 sm:w-6 text-white'/>
                        <div className='absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    </div>
                    
                    <span className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'>
                        Planify
                    </span>
                </div>
            </div>
        </header>
    )
}

export default Navbar
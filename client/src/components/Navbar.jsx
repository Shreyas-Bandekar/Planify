import React from 'react'
import { useNavigate } from 'react-router-dom'
import {Zap} from 'lucide-react'

const Navbar = () => {

    const navigate = useNavigate();

return (
    <header className='sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans'>
            <div className='flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6 max-w-7xl mx-auto'> 
                    <div className='flex gap-2 cursor-pointer group bg-gradient-to-r from-cyan-800 to-teal-600 text-white hover:scale-105 transition-transform duration-200 ease-out text-xl sm:text-2xl md:text-3xl rounded-lg shadow-lg p-2 sm:p-3' 
                    onClick={() => navigate('/')}>
                            <Zap className='h-5 w-5 sm:h-6 sm:w-6 text-white'/>
                    </div>
            </div>
    </header>
)
}

export default Navbar
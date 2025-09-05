import React from 'react'
import { useNavigate } from 'react-router-dom'
import {Zap} from 'lucide-react'

const Navbar = () => {

    const navigate = useNavigate();

  return (
    <header className='sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans'>
        <div className='flex items-center justify-between px-4 py-3 md:py-6 max-w-7xl mx-auto'> 
            <div className='flex gap-2 cursor-pointer group text-cyan-500 font-bold hover:scale-105 transition-transform duration-200 ease-out text-2xl md:text-3xl'
            onClick={() => navigate('/')}>
            Planify</div>
            
        </div>
    </header>
  )
}

export default Navbar
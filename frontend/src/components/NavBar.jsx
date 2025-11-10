import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import {Link} from "react-router-dom"
import { useUserStore } from '../store/useUserStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const {user, logout} = useUserStore();

  const handleOnLogout = () => {
    logout()
  }

  

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={'/'}>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AI Resume Reviewer
              </span>
            </Link>
          </div>

          

          {user ?<Link to="/" onClick={handleOnLogout}>
            <button
              className="
                flex items-center
                px-6 py-2
                bg-gradient-to-r from-blue-600 to-cyan-500
                text-white rounded-lg font-medium
                hover:shadow-lg hover:scale-105
                transition-all duration-200
                gap-2
              "
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </Link>
          :(
            <div className="hidden md:flex items-center space-x-4">
                <Link to={'/login'}>
                  <button className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Login
                  </button>
                </Link>
                <Link to={'/signup'}>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
                   Sign Up
                  </button>
                </Link>
            </div>
          )}

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

     
    </nav>
  );
}

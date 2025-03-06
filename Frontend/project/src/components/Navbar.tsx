import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Train, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Train className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-gray-800">SigTrack</span>
          </div>
          {user && (
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <User className="h-5 w-5 text-gray-500" />
                <span className="ml-2 text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-primary transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-1">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
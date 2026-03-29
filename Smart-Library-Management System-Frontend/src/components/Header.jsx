import { BookOpen, LogOut } from 'lucide-react';

export const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 
                className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent" 
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Library System
              </h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name || 'User'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
              {user?.role || 'MEMBER'}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

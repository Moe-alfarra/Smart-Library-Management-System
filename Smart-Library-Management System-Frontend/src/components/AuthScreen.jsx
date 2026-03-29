import { useState } from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.auth.login(formData.email, formData.password);
        localStorage.setItem('token', response.accessToken);
        onLogin(response.accessToken);
      } else {
        await api.auth.register(formData.name, formData.email, formData.password);
        const response = await api.auth.login(formData.email, formData.password);
        localStorage.setItem('token', response.accessToken);
        onLogin(response.accessToken);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-100">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl shadow-lg">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 
            className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent" 
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Library System
          </h1>
          <p 
            className="text-center text-gray-600 mb-8" 
            style={{ fontFamily: '"Source Serif Pro", serif' }}
          >
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Error:</strong> {error}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Backend:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(formData);
      } else {
        await register(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-md">
        <div className="stat-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl text-accent mb-2">Hero Bank System</h1>
            <p className="text-sm text-text3">Secure Banking Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label text-xs text-text3 tracking-wider uppercase">
                {isLogin ? 'Email' : 'Full Name'}
              </label>
              <input
                type={isLogin ? 'email' : 'text'}
                name={isLogin ? 'email' : 'fullName'}
                value={isLogin ? formData.email : formData.fullName || ''}
                onChange={handleChange}
                className="form-input"
                placeholder={isLogin ? 'Enter your email' : 'Enter your full name'}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="form-label text-xs text-text3 tracking-wider uppercase">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            <div>
              <label className="form-label text-xs text-text3 tracking-wider uppercase">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="alert error bg-red-bg text-red border border-red/20 p-2.5 rounded-r text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent text-sm hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

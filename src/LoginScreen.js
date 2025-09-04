import React, { useState } from 'react';
import Button from './components/Button';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Login attempt:', { email: formData.email, password: formData.password });
      // Here you would typically send to your backend API
      alert('Login submitted! Check console for details.');
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Create account attempt:', formData);
      // Here you would typically send to your backend API
      alert('Account creation submitted! Check console for details.');
    }
  };

  const handleBecomeHost = () => {
    console.log('Become an event host clicked');
    alert('Redirecting to host request page...');
    // Navigate to host request page
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
              <span className="text-gray-500 text-sm font-medium">Logo</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">PUK360</h1>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            {isLogin ? 'Log in as student' : 'Create student account'}
          </h2>
        </div>

        {/* Login/Signup Form */}
        <div className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
            />
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
              />
            </div>
          )}
        </div>

        {/* Toggle between Login/Create Account */}
        <Button 
        onClick={handleSubmit} 
        variant="primary" 
        fullWidth={true}
        >
        {isLogin ? 'Log in' : 'Create account'}
        </Button>

        {/* Become Event Host Link */}
        {isLogin && (
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-2">Become an event host?</p>
            <Button
              onClick={handleBecomeHost}
              variant="link"
            >
              Request Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
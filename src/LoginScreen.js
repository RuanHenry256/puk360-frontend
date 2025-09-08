import React, { useState } from 'react';
import Button from './components/Button'; // ✅ Import your reusable Button

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
      alert('Login submitted! Check console for details.');
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Create account attempt:', formData);
      alert('Account creation submitted! Check console for details.');
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', confirmPassword: '' });
  };

  const handleBecomeHost = () => {
    console.log('Become an event host clicked');
    alert('Redirecting to host request page...');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-sm font-medium">Logo</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary">PUK360</h1>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-secondary text-center">
              {isLogin ? 'Log in as student' : 'Create student account'}
            </h2>
          </div>

          {/* Card Container */}
          <div className="bg-surface rounded-lg shadow-xl p-6 sm:p-8">
            
            {/* Form Section */}
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500 transition duration-200"
                />
              </div>

              <div className="flex flex-col">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500 transition duration-200"
                />
              </div>

              {!isLogin && (
                <div className="flex flex-col">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500 transition duration-200"
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleSubmit} 
                variant="primary" 
                fullWidth={true}
                size="large"
              >
                {isLogin ? 'Log in' : 'Create account'}
              </Button>

              <Button 
                onClick={handleToggleMode}
                variant="outline" 
                fullWidth={true}
              >
                {isLogin ? 'Create account' : 'Back to login'}
              </Button>
            </div>

            {/* Host Request */}
            {isLogin && (
              <div className="flex flex-col items-center mt-8 pt-6 border-t border-gray-200 space-y-2">
                <p className="text-primary text-center">Become an event host?</p>
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
      </div>

      <div className="flex-shrink-0 h-8"></div>
    </div>
  );
};

export default LoginScreen;

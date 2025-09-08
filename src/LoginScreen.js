import React, { useState } from 'react';

// Button Component (inline for demo)
const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2';
  
  const variants = {
    primary: 'bg-gray-300 hover:bg-gray-400 text-gray-700 focus:ring-gray-500',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
    link: 'text-blue-600 hover:text-blue-800 underline bg-transparent p-0 rounded-none focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };
  
  const sizes = {
    small: 'py-2 px-3 text-sm',
    medium: 'py-3 px-4 text-base',
    large: 'py-4 px-6 text-lg'
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? disabledStyles : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};

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
    // Clear form when switching modes
    setFormData({ email: '', password: '', confirmPassword: '' });
  };

  const handleBecomeHost = () => {
    console.log('Become an event host clicked');
    alert('Redirecting to host request page...');
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Main Container - Using flexbox for better space distribution */}
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          
          {/* Header Section - Separate flex container */}
          <div className="flex flex-col items-center mb-8 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-sm font-medium">Logo</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">PUK360</h1>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 text-center">
              {isLogin ? 'Log in as student' : 'Create student account'}
            </h2>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
            
            {/* Form Section */}
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition duration-200"
                />
              </div>

              <div className="flex flex-col">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition duration-200"
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
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition duration-200"
                  />
                </div>
              )}
            </div>

            {/* Button Section - Separate flex container */}
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleSubmit} 
                variant="secondary" 
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

            {/* Host Request Section */}
            {isLogin && (
              <div className="flex flex-col items-center mt-8 pt-6 border-t border-gray-200 space-y-2">
                <p className="text-gray-600 text-center">Become an event host?</p>
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

      {/* Footer spacer - helps with mobile spacing */}
      <div className="flex-shrink-0 h-8"></div>
    </div>
  );
};

export default LoginScreen;
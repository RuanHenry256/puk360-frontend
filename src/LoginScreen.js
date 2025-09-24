/**
 * Login and registration screen.
 * Lets users enter credentials to sign in or create an account, calls the API,
 * stores JWT + user in localStorage, and notifies parent on success.
 */
import React, { useState } from 'react';
import Button from './components/Button'; // Ensure this path is correct
import { api } from './api/client';

const LoginScreen = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',          // only used for register
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");   // show backend errors
  const [success, setSuccess] = useState(""); // show success messages

  const handleInputChange = (e) => {
    setError("");
    setSuccess("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError("Please enter your name.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        // LOGIN
        const { token, user } = await api.login(formData.email, formData.password);
        // store token for later authenticated calls
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setSuccess("Logged in successfully.");
        // Notify parent to switch to blank page
        if (typeof onLoginSuccess === 'function') onLoginSuccess();
      } else {
        // REGISTER (name, email, password)
        const { token, user } = await api.register(formData.name, formData.email, formData.password);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setSuccess("Account created successfully.");
        // Optionally switch to login mode:
        // setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError("");
    setSuccess("");
  };

  const handleBecomeHost = () => {
    // You can navigate to a Host Request page here
    // navigate('/host-request');
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

            {/* Status messages */}
            {error && (
              <div className="mb-4 text-red-600 text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-4 text-green-600 text-sm">{success}</div>
            )}
            
            {/* Form Section */}
            <div className="flex flex-col space-y-4 mb-6">
              {!isLogin && (
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500 transition duration-200"
                  />
                </div>
              )}

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
                disabled={loading}
              >
                {loading ? (isLogin ? 'Logging in…' : 'Creating…') : (isLogin ? 'Log in' : 'Create account')}
              </Button>

              <Button 
                onClick={handleToggleMode}
                variant="outline" 
                fullWidth={true}
                disabled={loading}
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
/**
 * Login and registration screen.
 * Lets users enter credentials to sign in or create an account, calls the API,
 * stores JWT + user in localStorage, and notifies parent on success.
 */
import React, { useState } from 'react';
import Button from './components/Button'; // Ensure this path is correct
import { api } from './api/client';
import './NWUBackground.css'; // background CSS
import nwuLogo from './assets/nwu-logo-round-main.png'; // ✅ actual logo

const LoginScreen = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',          // only used for register
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");   
  const [success, setSuccess] = useState(""); 

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
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setSuccess("Logged in successfully.");
        if (typeof onLoginSuccess === 'function') onLoginSuccess();
      } else {
        // REGISTER
        const { token, user } = await api.register(formData.name, formData.email, formData.password);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setSuccess("Account created successfully.");
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
    alert('Redirecting to host request page...');
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <div className="nwu-background"></div>

      {/* Foreground content */}
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-md mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10 space-y-5">
            <div className="flex items-center space-x-4">
              {/* ✅ Real logo (slightly larger) */}
              <img
                src={nwuLogo}
                alt="NWU logo"
                className="w-[68px] h-[68px] rounded-full object-contain ring-2 ring-primary/30 bg-white/80"
              />
              {/* ✅ Punchier title */}
              <h1 className="text-5xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PUK360
              </h1>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-secondary text-center">
              {isLogin ? 'Log in as student' : 'Create student account'}
            </h2>
          </div>

          {/* Card Container — two layers */}
          <div className="relative rounded-2xl border-2 border-primary/50 dark:border-primary-dm/50 overflow-hidden">
            {/* BACKDROP LAYER */}
            <div className="
              absolute inset-0
              bg-primary/6 dark:bg-primary-dm/8
              backdrop-blur-[3px]
              supports-[backdrop-filter:none]:bg-white/92
            " />

            {/* CONTENT LAYER */}
            <div className="relative z-10 p-6 sm:p-8">
              {/* Status messages */}
              {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
              {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
              
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
                      className="w-full px-4 py-3 
                                 bg-white dark:bg-surface-dm
                                 border border-primary/20 dark:border-primary-dm/25 
                                 rounded-xl focus:outline-none focus:ring-2 
                                 focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                                 placeholder-black/40 dark:placeholder-white/40 
                                 transition duration-200"
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
                    className="w-full px-4 py-3 
                               bg-white dark:bg-surface-dm
                               border border-primary/20 dark:border-primary-dm/25 
                               rounded-xl focus:outline-none focus:ring-2 
                               focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                               placeholder-black/40 dark:placeholder-white/40 
                               transition duration-200"
                  />
                </div>

                <div className="flex flex-col">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 
                               bg-white dark:bg-surface-dm
                               border border-primary/20 dark:border-primary-dm/25 
                               rounded-xl focus:outline-none focus:ring-2 
                               focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                               placeholder-black/40 dark:placeholder-white/40 
                               transition duration-200"
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
                      className="w-full px-4 py-3 
                                 bg-white dark:bg-surface-dm
                                 border border-primary/20 dark:border-primary-dm/25 
                                 rounded-xl focus:outline-none focus:ring-2 
                                 focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                                 placeholder-black/40 dark:placeholder-white/40 
                                 transition duration-200"
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
                <div className="flex flex-col items-center mt-8 pt-6 border-t border-primary/20 dark:border-primary-dm/25 space-y-2">
                  <p className="text-primary text-center dark:text-primary-dm">Become an event host?</p>
                  <Button onClick={handleBecomeHost} variant="link">
                    Request Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 h-8"></div>
    </div>
  );
};

export default LoginScreen;

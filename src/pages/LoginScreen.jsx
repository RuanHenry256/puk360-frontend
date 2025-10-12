/**
 * Login and registration screen.
 * Lets users enter credentials to sign in or create an account, calls the API,
 * stores JWT + user in localStorage, and notifies parent on success.
 */
import React, { useState } from 'react';
// TEMPORARY (for rapid admin UI iteration): Admin dashboard import
// - Scoped within LoginScreen so removing this button removes all bypass artifacts.
// - IMPORTANT: Delete this import and related code when done.
// TEMPORARY (for rapid host UI iteration): Host dashboard import
// - Encapsulated in this file to avoid persistent access paths.
// - IMPORTANT: Delete this import and related code when done.
import Button from '../components/Button'; // Ensure this path is correct
import { api } from '../api/client';
import '../styles/NWUBackground.css'; // background CSS
import nwuLogo from '../assets/nwu-logo-round-main.png'; // ✅ actual logo

const LoginScreen = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  // TEMPORARY state toggled by the !!!ADMIN button.
  // When true, we render the Admin dashboard directly from LoginScreen,
  // completely bypassing auth for design/testing only.
  // Removing the button and this state fully disables the bypass.
  // TEMPORARY state toggled by the !!!HOST button.
  // Mirrors the admin bypass but routes to the host workspace.
  // Removal of this and the related button fully eliminates the bypass.
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

  // If a temporary bypass is active, render the destination directly.
  // NOTE: These bypasses are fully encapsulated in this file.
  // Role-based routing now handled by App after successful login.

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <div className="nwu-background"></div>

      {/* Foreground content */}
      <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full mx-auto max-w-md lg:max-w-6xl">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
            <div className="hidden lg:flex lg:col-span-7 flex-col items-start">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={nwuLogo}
                  alt="NWU logo"
                  className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full object-contain ring-2 ring-primary/30 bg-white/80"
                />
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  PUK360
                </h1>
              </div>
              <p className="text-lg text-black/70 dark:text-white/70 max-w-xl">
                Discover campus events, join societies, and stay in the loop.
                
              </p>
              <p className="text-lg text-black/70 dark:text-white/70 max-w-xl">
                Sign in to personalize your feed and RSVP in one click.
              </p>
              <ul className="mt-6 space-y-2 text-black/70 dark:text-white/70">
                <li>• Tailored event recommendations</li>
                <li>• Quick RSVP and reminders</li>
                <li>• Host tools for societies and faculties</li>
              </ul>
            </div>
            <div className="lg:col-span-5 w-full max-w-md mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10 space-y-5">
            <div className="flex items-center space-x-4">
              {/*  Real logo (slightly larger) */}
              <img
                src={nwuLogo}
                alt="NWU logo"
                className="w-[72px] h-[72px] lg:w-[84px] lg:h-[84px] rounded-full object-contain ring-2 ring-primary/30 bg-white/80"
              />
              {/* ✅ Punchier title */}
              <h1 className="text-5xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PUK360
              </h1>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-secondary text-center">
              {isLogin ? 'Sign in to PUK360' : 'Create your account'}
            </h2>
          </div>

          {/* Card Container – two layers */}
          <div className="relative rounded-2xl border-2 border-primary/50 dark:border-primary-dm/50 overflow-hidden shadow-md lg:shadow-xl">
            {/* BACKDROP LAYER */}
            <div className="
              absolute inset-0
              bg-primary/6 dark:bg-primary-dm/8
              backdrop-blur-[3px]
              supports-[backdrop-filter:none]:bg-white/92
            " />

            {/* CONTENT LAYER */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
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

                {isLogin ? (
                  <div className="text-center text-sm text-secondary">
                    <div>Don’t have an account yet?</div>
                    <button
                      type="button"
                      onClick={handleToggleMode}
                      className="text-primary font-semibold hover:underline text-[1.05em] mt-1"
                      disabled={loading}
                    >
                      Sign up here
                    </button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleToggleMode}
                    variant="outline" 
                    fullWidth={true}
                    disabled={loading}
                  >
                    Back to login
                  </Button>
                )}
              </div>

              {/* Host request entry moved to Profile screen */}

              {/* Dev-only bypass buttons removed now that role-based routing is live. */}
            </div>
          </div>
          </div>
        </div>
        </div>
      </div>

      <div className="relative z-10 py-6">
        <p className="text-center text-primary text-xs sm:text-sm">
          © {new Date().getFullYear()} NWU. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;

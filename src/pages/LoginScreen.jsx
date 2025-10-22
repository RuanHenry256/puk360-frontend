/**
 * Login and registration screen.
 * Compact interior (smaller paddings/gaps/controls) so both modes fit
 * inside a fixed-height, smaller card — no scrollbars. Fonts unchanged.
 */
import React, { useState } from 'react';
import Button from '../components/Button';
import { api } from '../api/client';
import '../styles/NWUBackground.css';
import brandLogo from '../assets/puk360-logo-circle.png';
import groupPhoto from '../assets/group photo login.png';

const LoginScreen = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [acceptedTcs, setAcceptedTcs] = useState(false);
  const [showTcs, setShowTcs] = useState(false);

  const handleInputChange = (e) => {
    setError("");
    setSuccess("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      if (!acceptedTcs) {
        setError("You must accept the Terms and Conditions to create an account.");
        return;
      }
    }

    try {
      setLoading(true);
      if (isLogin) {
        const { token, user } = await api.login(formData.email, formData.password);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setSuccess("Logged in successfully.");
        if (typeof onLoginSuccess === "function") onLoginSuccess();
      } else {
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

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <div className="nwu-background"></div>

      {/* Foreground content */}
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* outer width shrunk */}
        <div className="w-full mx-auto max-w-md lg:max-w-4xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-6 space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src={brandLogo}
                alt="PUK360 logo"
                className="w-[64px] h-[64px] lg:w-[72px] lg:h-[72px] rounded-full object-contain ring-2 ring-primary/30 bg-white/80"
              />
              <h1 className="text-4xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PUK360
              </h1>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-secondary text-center lg:hidden">
              {isLogin ? 'Sign in to PUK360' : 'Create your account'}
            </h2>
          </div>

          {/* inner width shrunk */}
          <div className="w-full mx-auto lg:max-w-3xl">
            {/* fixed height; interior compact => no scrollbar */}
            <div className="relative rounded-2xl border-2 border-primary/50 dark:border-primary-dm/50 overflow-hidden shadow-md lg:shadow-xl lg:flex lg:flex-row lg:h-[540px]">
              {/* back layer */}
              <div className="absolute inset-0 bg-primary/6 dark:bg-primary-dm/8 backdrop-blur-[3px] supports-[backdrop-filter:none]:bg-white/92" />

              {/* Left image (50%) */}
              <div className="hidden lg:flex relative z-10 lg:w-1/2">
                <img
                  src={groupPhoto}
                  alt="Students using PUK360"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right form (50%) */}
              {/* NOTE: no overflow-y here; we fit everything by compacting spacing */}
              <div className="relative z-10 w-full lg:w-1/2 p-3 sm:p-4 lg:p-5 flex">
                <div className="w-full flex flex-col justify-center">
                  {/* Desktop subheading (smaller margin) */}
                  <h2 className="hidden lg:block text-lg font-semibold text-secondary text-center mb-3">
                    {isLogin ? 'Sign in to PUK360' : 'Create your account'}
                  </h2>

                  {/* Status messages */}
                  {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
                  {success && <div className="mb-3 text-green-600 text-sm">{success}</div>}

                  {/* Form (tighter gaps) */}
                  <div className="flex flex-col space-y-3 mb-4">
                    {!isLogin && (
                      <div className="flex flex-col">
                        <label htmlFor="name" className="text-sm font-medium text-secondary mb-0.5">Full name</label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2 
                                     bg-white dark:bg-surface-dm
                                     border border-primary/20 dark:border-primary-dm/25 
                                     rounded-xl focus:outline-none focus:ring-2 
                                     focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                                     transition duration-200"
                        />
                      </div>
                    )}

                    <div className="flex flex-col">
                      <label htmlFor="email" className="text-sm font-medium text-secondary mb-0.5">Email</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 
                                   bg-white dark:bg-surface-dm
                                   border border-primary/20 dark:border-primary-dm/25 
                                   rounded-xl focus:outline-none focus:ring-2 
                                   focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                                   transition duration-200"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="password" className="text-sm font-medium text-secondary mb-0.5">Password</label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 
                                   bg-white dark:bg-surface-dm
                                   border border-primary/20 dark:border-primary-dm/25 
                                   rounded-xl focus:outline-none focus:ring-2 
                                   focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                                   transition duration-200"
                      />
                    </div>

                    {!isLogin && (
                      <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-secondary mb-0.5">Confirm password</label>
                        <input
                          id="confirmPassword"
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2 
                                     bg-white dark:bg-surface-dm
                                     border border-primary/20 dark:border-primary-dm/25 
                                     rounded-xl focus:outline-none focus:ring-2 
                                     focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                                     transition duration-200"
                        />
                      </div>
                    )}

                    {!isLogin && (
                      <div className="mt-1 flex items-start gap-2 text-sm text-secondary">
                        <input
                          id="acceptTcs"
                          type="checkbox"
                          checked={acceptedTcs}
                          onChange={(e)=>setAcceptedTcs(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-secondary/60"
                        />
                        <label htmlFor="acceptTcs" className="leading-tight">
                          I agree to the{' '}
                          <button type="button" onClick={()=>setShowTcs(true)} className="text-primary font-semibold hover:underline">
                            Terms and Conditions
                          </button>.
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Buttons (tighter vertical spacing, same font) */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={handleSubmit}
                      variant="primary"
                      fullWidth={true}
                      size="medium"
                      disabled={loading || (!isLogin && !acceptedTcs)}
                    >
                      {loading ? (isLogin ? 'Logging in…' : 'Creating…') : (isLogin ? 'Log in' : 'Create account')}
                    </Button>

                    {isLogin ? (
                      <div className="text-center text-sm text-secondary">
                        <div>Don’t have an account yet?</div>
                        <button
                          type="button"
                          onClick={handleToggleMode}
                          className="text-primary font-semibold hover:underline text-[1.05em] mt-0.5"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-6">
        <p className="text-center text-primary text-xs sm:text-sm">
          © {new Date().getFullYear()} NWU. All rights reserved.
        </p>
      </div>

      {/* Terms & Conditions Modal */}
      {showTcs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-auto rounded-2xl border border-secondary/40 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-primary">Terms and Conditions</h3>
              <button type="button" className="text-secondary hover:text-primary" onClick={()=>setShowTcs(false)}>Close</button>
            </div>
            <div className="space-y-4 text-sm text-secondary text-left">
              <p>Welcome to PUK360. By creating an account, you agree to the following:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Be respectful. Do not post hate speech, harassment, threats, or abusive content in reviews or anywhere in the app.</li>
                <li>Share honest and relevant reviews about events you attended. Avoid spam, advertising, or misleading claims.</li>
                <li>Respect privacy. Do not post other people’s personal information without their consent.</li>
                <li>Only RSVP to events you intend to attend. You may cancel RSVPs before the event starts.</li>
                <li>Event hosts and administrators may view attendee names and emails for coordination and safety purposes.</li>
                <li>We may remove content or restrict accounts that violate these terms or applicable laws.</li>
                <li>Your data is handled according to our Privacy Notice. We store essential profile information and event activity to provide the service.</li>
              </ul>
              <p>These terms may be updated. Continued use of PUK360 after updates means you accept the changes.</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="button" variant="primary" onClick={()=>setShowTcs(false)}>Got it</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;

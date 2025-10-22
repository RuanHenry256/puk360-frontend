/**
 * Login and registration screen (compact, original-glass effect)
 * ~80% scale, no scrollbars, 50/50 split, and the SAME transparency classes
 * you used originally: bg-primary/6 + backdrop-blur-[3px] + supports fallback.
 */
import React, { useState } from "react";
import Button from "../components/Button";
import { api } from "../api/client";
import "../styles/NWUBackground.css";
import brandLogo from "../assets/puk360-logo-circle.png";
import groupPhoto from "../assets/group photo login.png";

const LoginScreen = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <div className="nwu-background"></div>

      {/* Foreground */}
      <div className="flex-1 flex flex-col justify-center py-6 px-3 sm:px-5 lg:px-6 relative z-10">
        {/* ~80% outer width */}
        <div className="w-full mx-auto max-w-md lg:max-w-4xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-5 space-y-2.5">
            <div className="flex items-center space-x-2.5">
              <img
                src={brandLogo}
                alt="PUK360 logo"
                className="w-[56px] h-[56px] lg:w-[64px] lg:h-[64px] rounded-full object-contain ring-2 ring-primary/30 bg-white/80"
              />
              <h1 className="text-3xl sm:text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PUK360
              </h1>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-secondary text-center lg:hidden">
              {isLogin ? "Sign in to PUK360" : "Create your account"}
            </h2>
          </div>

          {/* Card (compact) */}
          <div className="w-full mx-auto lg:max-w-3xl">
            <div className="relative rounded-2xl border-2 border-primary/50 dark:border-primary-dm/50 overflow-hidden shadow-md lg:shadow-lg lg:flex lg:flex-row lg:h-[460px]">
              {/* ✅ ORIGINAL GLASS EFFECT (exact classes from your first code) */}
              <div
                className="
                  absolute inset-0
                  bg-primary/6 dark:bg-primary-dm/8
                  backdrop-blur-[3px]
                  supports-[backdrop-filter:none]:bg-white/92
                "
              />

              {/* Left image (50%) */}
              <div className="hidden lg:flex relative z-10 lg:w-1/2">
                <img
                  src={groupPhoto}
                  alt="Students using PUK360"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right form (50%) */}
              <div className="relative z-10 w-full lg:w-1/2 p-3 sm:p-4 lg:p-5 flex">
                <div className="w-full flex flex-col justify-center">
                  <h2 className="hidden lg:block text-base font-semibold text-secondary text-center mb-2">
                    {isLogin ? "Sign in to PUK360" : "Create your account"}
                  </h2>

                  {/* Messages */}
                  {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
                  {success && <div className="mb-2 text-green-600 text-sm">{success}</div>}

                  {/* Form (compact) */}
                  <div className="flex flex-col space-y-2.5 mb-3">
                    {!isLogin && (
                      <div className="flex flex-col">
                        <label htmlFor="name" className="text-xs font-medium text-secondary mb-0.5">Full name</label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 bg-white border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        />
                      </div>
                    )}

                    <div className="flex flex-col">
                      <label htmlFor="email" className="text-xs font-medium text-secondary mb-0.5">Email</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 bg-white border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="password" className="text-xs font-medium text-secondary mb-0.5">Password</label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 bg-white border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      />
                    </div>

                    {!isLogin && (
                      <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="text-xs font-medium text-secondary mb-0.5">Confirm password</label>
                        <input
                          id="confirmPassword"
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 bg-white border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        />
                      </div>
                    )}

                    {!isLogin && (
                      <div className="mt-1 flex items-start gap-2 text-xs text-secondary">
                        <input
                          id="acceptTcs"
                          type="checkbox"
                          checked={acceptedTcs}
                          onChange={(e) => setAcceptedTcs(e.target.checked)}
                          className="mt-0.5 h-3.5 w-3.5 rounded border-secondary/60"
                        />
                        <label htmlFor="acceptTcs" className="leading-tight">
                          I agree to the{" "}
                          <button type="button" onClick={() => setShowTcs(true)} className="text-primary font-semibold hover:underline">
                            Terms and Conditions
                          </button>.
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col space-y-1.5">
                    <Button
                      onClick={handleSubmit}
                      variant="primary"
                      fullWidth={true}
                      size="small"
                      disabled={loading || (!isLogin && !acceptedTcs)}
                    >
                      {loading ? (isLogin ? "Logging in…" : "Creating…") : (isLogin ? "Log in" : "Create account")}
                    </Button>

                    {isLogin ? (
                      <div className="text-center text-xs text-secondary">
                        <div>Don’t have an account yet?</div>
                        <button
                          type="button"
                          onClick={handleToggleMode}
                          className="text-primary font-semibold hover:underline text-[1em] mt-0.5"
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
                        size="small"
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
      <div className="relative z-10 py-4">
        <p className="text-center text-primary text-[0.7rem] sm:text-xs">
          © {new Date().getFullYear()} NWU. All rights reserved.
        </p>
      </div>

      {/* Terms & Conditions Modal */}
      {showTcs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md max-h-[85vh] overflow-auto rounded-2xl border border-secondary/40 bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">Terms and Conditions</h3>
              <button type="button" className="text-secondary hover:text-primary" onClick={() => setShowTcs(false)}>
                Close
              </button>
            </div>
            <div className="space-y-2 text-xs text-secondary text-left">
              <p>Welcome to PUK360. By creating an account, you agree to the following:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>No hate speech, harassment, or abusive content.</li>
                <li>Post honest, relevant reviews only.</li>
                <li>Respect privacy; do not share others’ info.</li>
                <li>RSVP only to events you plan to attend.</li>
                <li>Hosts/admins may view attendee details for coordination.</li>
                <li>Accounts may be restricted for violating these terms.</li>
                <li>Data handled per our Privacy Notice for service provision.</li>
              </ul>
              <p>Continued use means you accept any updates to these terms.</p>
            </div>
            <div className="mt-3 flex justify-end">
              <Button type="button" variant="primary" size="small" onClick={() => setShowTcs(false)}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;

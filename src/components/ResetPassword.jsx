import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);
  const [checkingHash, setCheckingHash] = useState(true); // Track if we're still waiting for hash to load
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Check if we have the necessary hash fragments from Supabase
    // Supabase password reset uses URL hash fragments (#access_token=...)
    // Don't call getSession() here as it may abort - just check hash params
    // Check immediately, then listen for hash changes (hash might not be ready on first mount)
    const checkHash = () => {
      const hashString = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hashString);
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'recovery') {
        setIsValidLink(true);
        setError(null); // Clear any previous error
        setCheckingHash(false); // Hash is valid, stop checking
        // Supabase will automatically process the hash and establish a session
        // We'll verify the session is ready in the submit handler
        return true;
      } else if (hashString && (!accessToken || type !== 'recovery')) {
        // Hash exists but doesn't have the right params - this is an invalid link
        setError('Invalid or expired reset link. Please request a new password reset.');
        setIsValidLink(false);
        setCheckingHash(false); // Hash is invalid, stop checking
        return false;
      }
      // No hash yet - might be loading, don't set error yet
      return false;
    };

    // Check immediately
    if (checkHash()) {
      return; // Hash is valid, no need to check again
    }

    // Listen for hash changes (in case hash loads after component mount)
    const handleHashChange = () => {
      checkHash();
    };
    window.addEventListener('hashchange', handleHashChange);

    // Poll for hash (in case hash loads without triggering hashchange event)
    // Check multiple times to catch late-loading hashes (Supabase may take 5-10 seconds)
    let pollAttempts = 0;
    const maxPollAttempts = 30; // Check for up to 15 seconds (30 * 500ms)
    const pollInterval = setInterval(() => {
      pollAttempts++;
      if (checkHash()) {
        clearInterval(pollInterval);
        window.removeEventListener('hashchange', handleHashChange);
        return; // Hash is valid, done
      } else if (pollAttempts >= maxPollAttempts) {
        // Reached max polling attempts, but don't set error yet
        // The timeout will handle error display after 20 seconds total
        clearInterval(pollInterval);
        window.removeEventListener('hashchange', handleHashChange);
      }
    }, 500); // Check every 500ms for up to 15 seconds

    // Also check again after a longer delay as fallback (20 seconds total)
    const timeoutId = setTimeout(() => {
      clearInterval(pollInterval);
      if (!checkHash() && !window.location.hash.substring(1)) {
        // Still no hash after delay - this is likely an invalid link
        setError('Invalid or expired reset link. Please request a new password reset.');
        setIsValidLink(false);
        setCheckingHash(false); // Done checking, hash not found
      }
      window.removeEventListener('hashchange', handleHashChange);
    }, 20000); // Wait up to 20 seconds for hash to load (Supabase can be slow)

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      // Get access token - try hash first, then session (Supabase may have processed hash already)
      let accessToken = null;
      const hashString = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hashString);
      accessToken = hashParams.get('access_token');

      // If hash doesn't have token, try to get it from the session (Supabase processed the hash)
      if (!accessToken) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          accessToken = session?.access_token;
        } catch (sessionErr) {
          // getSession() may abort - continue without session token
        }
      }

      if (!accessToken) {
        setError('Invalid reset link. Please request a new password reset.');
        setLoading(false);
        return;
      }

      // Use direct fetch to Supabase Auth API (bypasses client abort issues, similar to CompleteSignup)
      // Retry logic to handle any temporary AbortErrors
      let updateError = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount <= maxRetries) {
        try {
          // Add a small delay before retries (helps clear any pending aborts)
          if (retryCount > 0) {
            await new Promise(resolve => setTimeout(resolve, 200 * retryCount));
          }

          // Use direct fetch to bypass Supabase client's abort controllers
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/user`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                password: formData.password
              }),
              // Don't use AbortController - let the request complete naturally
              signal: undefined
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to reset password' }));
            updateError = { message: errorData.message || errorData.error_description || `HTTP ${response.status}` };
            break;
          }

          // Success!
          updateError = null;
          break;
        } catch (err) {
          // Check if it's an AbortError
          const isAbortError = err?.name === 'AbortError' || err?.message?.includes('aborted');
          if (isAbortError && retryCount < maxRetries) {
            // Retry on AbortError
            updateError = { message: 'AbortError: signal is aborted without reason' };
            retryCount++;
            continue;
          } else if (!isAbortError) {
            // Non-AbortError - don't retry
            updateError = err;
            break;
          } else {
            // AbortError but max retries reached
            updateError = { message: 'Request was cancelled. Please refresh the page and try again.' };
            break;
          }
        }
      }

      // Handle errors after all retries
      if (updateError) {
        // Handle specific error cases
        const isAbortError = updateError.message?.includes('AbortError') || updateError.message?.includes('aborted');
        if (isAbortError) {
          setError('Unable to reset password. Please refresh the page and try again, or request a new password reset link.');
        } else if (updateError.message?.includes('session') || updateError.message?.includes('token') || updateError.message?.includes('expired')) {
          setError('Your reset link may have expired. Please request a new password reset.');
        } else {
          setError(updateError.message || 'Failed to reset password. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Success!
      setSuccess(true);
      setLoading(false);

      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err) {
      // Handle unexpected errors
      if (err?.name === 'AbortError' || err?.message?.includes('aborted')) {
        setError('Unable to reset password. Please refresh the page and try again.');
      } else {
        setError(err?.message || 'An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  // Show loading state while checking for hash (don't show error immediately)
  if (checkingHash && !isValidLink && !success) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Show error state if link is invalid (only after we've confirmed it's invalid)
  if (error && !isValidLink && !success) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl shadow-purple-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              
              <div className="relative z-10 text-center">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  Invalid Reset Link
                </h1>
                
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>

                <p className="text-slate-400 text-sm mb-6">
                  The password reset link may have expired or is invalid. Please request a new one.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate('/forgot-password')}
                    className="px-6 py-3 bg-white text-slate-950 hover:bg-purple-50 rounded-xl font-bold transition-all"
                  >
                    Request New Link
                  </button>
                  <button
                    onClick={() => navigate('/signin')}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl shadow-purple-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              
              <div className="relative z-10 text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-400" size={48} />
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  Password Reset Successful!
                </h1>
                
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Your password has been successfully updated. You can now sign in with your new password.
                </p>

                <p className="text-slate-500 text-sm mb-6">
                  Redirecting to sign in page...
                </p>

                <button
                  onClick={() => navigate('/signin')}
                  className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl shadow-purple-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                Reset Your Password
              </h1>
              <p className="text-slate-400 text-lg mb-8">
                Enter your new password below. Make sure it's strong and secure.
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400 mb-5">
                  {error}
                </div>
              )}

              {/* Password Requirements */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                <p className="text-slate-300 text-sm font-semibold mb-2">Password Requirements:</p>
                <ul className="text-slate-400 text-xs space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="text-slate-500" size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-12 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="text-slate-500" size={18} />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-12 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

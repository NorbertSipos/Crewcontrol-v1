import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!', { email: formData.email });
    setError(null);
    setLoading(true);

    try {
      console.log('Starting sign in...');
      
      // Verify Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        setError('Supabase configuration is missing. Please check your environment variables.');
        setLoading(false);
        return;
      }
      
      // Retry logic for sign-in (handles AbortError and hanging requests)
      let data = null;
      let signInError = null;
      const maxRetries = 3;
      let retryCount = 0;
      let success = false;

      while (retryCount <= maxRetries && !success) {
        try {
          // Add a small delay before retry (except first attempt)
          if (retryCount > 0) {
            const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000); // Exponential backoff, max 5s
            console.log(`Retrying sign in (attempt ${retryCount + 1}/${maxRetries + 1}) after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }

          // Wrap each attempt in a timeout to prevent hanging
          const signInPromise = supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Sign in attempt ${retryCount + 1} timed out after 15 seconds`)), 15000)
          );

          const result = await Promise.race([signInPromise, timeoutPromise]);

          data = result.data;
          signInError = result.error;

          // If we got a response (success or error), mark as success
          if (data || signInError) {
            success = true;
          }
        } catch (err) {
          const errorMessage = err?.message || err?.toString() || 'Unknown error';
          const errorName = err?.name || 'Error';
          console.warn(`Sign in attempt ${retryCount + 1} failed:`, errorName, errorMessage, err);
          
          // If it's an AbortError or timeout and we have retries left, try again
          const isTimeout = errorMessage.includes('timed out') || errorName === 'AbortError';
          if (isTimeout && retryCount < maxRetries) {
            retryCount++;
            continue;
          }
          
          // If it's not a retryable error or we're out of retries, throw it
          throw err;
        }

        if (!success) {
          retryCount++;
        }
      }

      // If we exhausted all retries without getting a response
      if (!success && !data && !signInError) {
        console.error('All sign in attempts failed');
        throw new Error('Sign in request timed out. Please check your internet connection and try again.');
      }

      console.log('Sign in response received:', { hasUser: !!data?.user, hasError: !!signInError });

      if (signInError) {
        console.error('Sign in error:', signInError);
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (!data?.user) {
        console.error('No user data returned');
        setError('Sign in failed. Please try again.');
        setLoading(false);
        return;
      }

      console.log('Checking user profile for:', data.user.id);

      // Check if user has a profile in the users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('id, organization_id')
        .eq('id', data.user.id)
        .single();

      console.log('Profile check result:', { hasProfile: !!userProfile, hasError: !!profileError });

      // If profile doesn't exist (PGRST116 error), user needs to complete signup
      if (profileError && profileError.code !== 'PGRST116') {
        // Some other error occurred
        console.error('Error fetching user profile:', profileError);
      }

      setLoading(false);

      // If user doesn't have a profile or organization, redirect to complete signup
      if (!userProfile || !userProfile.organization_id) {
        console.log('Redirecting to complete signup');
        navigate('/complete-signup');
      } else {
        console.log('Redirecting to dashboard');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      const errorMessage = err?.message || 'An unexpected error occurred. Please try again.';
      
      // Provide more helpful error messages
      if (errorMessage.includes('timed out')) {
        setError('Connection timed out. Please check your internet connection and try again.');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(errorMessage);
      }
      
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Logo/Header */}
        <div className="pt-8 px-6">
          <Link to="/" className="inline-flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
              <Zap className="text-purple-400" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-purple-100 transition-colors">
              CrewControl
            </span>
          </Link>
        </div>

        {/* Main Sign In Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            
            {/* Card Container */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl shadow-purple-900/20 relative overflow-hidden">
              
              {/* Subtle Inner Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Sign in to manage your workforce operations
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}
                  
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Mail className="text-slate-500" size={18} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                      Password
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
                        placeholder="Enter your password"
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

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="remember"
                          checked={formData.remember}
                          onChange={handleChange}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 rounded-lg border-2 border-white/20 bg-black/30 peer-checked:bg-purple-500 peer-checked:border-purple-500 flex items-center justify-center transition-all duration-200 group-hover:border-purple-500/50 group-hover:bg-black/40">
                          <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors select-none">
                        Remember me
                      </span>
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-slate-950 py-3.5 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-10">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                  <div className="relative flex justify-center">
                  </div>
                </div>

                {/* Sign Up Link */}
                <Link to="/signup" className="cursor-pointer">
                  <button className="w-full border border-white/10 text-white py-3.5 rounded-xl font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2 group cursor-pointer">
                    Start free trial
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                {/* Security Note */}
                <p className="mt-6 text-center text-xs text-slate-600">
                  Enterprise-grade security. Your data is encrypted and protected.
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center space-x-4 text-sm">
              <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                Back to home
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                Privacy
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/terms" className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

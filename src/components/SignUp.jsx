import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Zap, Eye, EyeOff, User, MailCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const [accountData, setAccountData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const navigate = useNavigate();

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!accountData.email || !accountData.password || !accountData.fullName) {
      setError('Please fill in all fields');
      return false;
    }
    if (accountData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (accountData.password !== accountData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create Supabase Auth User
      // For managers: require email confirmation to catch typos
      // emailRedirectTo ensures users are redirected after confirming email
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: accountData.email,
        password: accountData.password,
        options: {
          data: {
            full_name: accountData.fullName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Check if email confirmation is required
      // Use authData.session directly instead of calling getSession() to avoid hanging
      // When email confirmation is enabled, authData.session will be null
      const needsEmailConfirmation = !authData.session;

      setLoading(false);

      if (needsEmailConfirmation) {
        // Email confirmation required - show success message
        setEmailSent(true);
      } else {
        // Email confirmation not required - redirect to complete signup
        navigate('/complete-signup');
      }

    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Show "Check your email" screen
  if (emailSent) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
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

          {/* Email Sent Message */}
          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl shadow-purple-900/20 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MailCheck className="text-purple-400" size={40} />
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                    Check your email
                  </h1>
                  <p className="text-slate-400 mb-6">
                    We've sent a confirmation link to <br />
                    <span className="text-white font-semibold">{accountData.email}</span>
                  </p>
                  <p className="text-slate-500 text-sm mb-10">
                    Click the link in the email to verify your account. After verification, you'll be able to complete your organization setup.
                  </p>

                  <div className="space-y-5">
                    <Link to="/signin" className="block">
                      <button className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer group">
                        Go to Sign In
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setEmailSent(false)}
                      className="w-full border border-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                    >
                      Back to Sign Up
                    </button>
                  </div>
                </div>
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

        {/* Main Sign Up Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl shadow-purple-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                    Create your account
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Start with your basic information. You'll set up your organization after email verification.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400 mb-5">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <User className="text-slate-500" size={18} />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={accountData.fullName}
                        onChange={handleAccountChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                        value={accountData.email}
                        onChange={handleAccountChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
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
                        value={accountData.password}
                        onChange={handleAccountChange}
                        required
                        className="w-full pl-12 pr-12 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="At least 6 characters"
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
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={accountData.confirmPassword}
                        onChange={handleAccountChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-slate-950 py-3.5 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
                      Sign in
                    </Link>
                  </p>
                </div>
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

export default SignUp;

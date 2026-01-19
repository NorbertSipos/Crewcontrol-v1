import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Request password reset from Supabase
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      // Success - show confirmation message
      setEmailSent(true);
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

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
                  Check Your Email
                </h1>
                
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  We've sent a password reset link to <strong className="text-white">{email}</strong>. Click the link in the email to reset your password.
                </p>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                  <p className="text-slate-300 text-sm">
                    <strong className="text-purple-400">💡 Tip:</strong> The link will expire in 1 hour. If you don't see the email, check your spam folder.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setEmailSent(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all"
                  >
                    Send Another Email
                  </button>
                  <Link
                    to="/signin"
                    className="px-6 py-3 bg-white text-slate-950 hover:bg-purple-50 rounded-xl font-bold transition-all text-center"
                  >
                    Back to Sign In
                  </Link>
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
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl shadow-purple-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
            
            <div className="relative z-10">
              {/* Back Button */}
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back to Sign In</span>
              </Link>

              {/* Header */}
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-slate-400 text-lg mb-8">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400 mb-5">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="text-slate-500" size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              {/* Help Text */}
              <p className="mt-6 text-center text-slate-500 text-sm">
                Remember your password?{' '}
                <Link to="/signin" className="text-purple-400 hover:text-purple-300 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle2, XCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

const AcceptInvite = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  // Fetch invitation details
  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link. No token provided.');
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/invitations?token=eq.${token}&select=*`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Prefer': 'return=representation'
            },
            signal: undefined
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch invitation');
        }

        const data = await response.json();
        const invite = data?.[0];

        if (!invite) {
          setError('Invitation not found. The link may be invalid or expired.');
          setLoading(false);
          return;
        }

        // Check if already accepted
        if (invite.accepted_at) {
          setError('This invitation has already been accepted.');
          setLoading(false);
          return;
        }

        // Check if expired
        if (new Date(invite.expires_at) < new Date()) {
          setError('This invitation has expired. Please contact your manager for a new invitation.');
          setLoading(false);
          return;
        }

        setInvitation(invite);
      } catch (err) {
        console.error('Error fetching invitation:', err);
        setError('Failed to load invitation. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setSubmitting(true);

    try {
      // Create Supabase Auth user
      // For invited employees: skip email confirmation (email is pre-validated by manager)
      // emailRedirectTo: null bypasses email confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          },
          emailRedirectTo: null // Skip confirmation for invited users
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Use database function to create user profile - this works even if email isn't confirmed yet
      // The function uses the invitation token for verification, not a session token
      const token = searchParams.get('token');
      
      const functionResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/create_user_from_invitation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            p_invitation_token: token,
            p_user_id: authData.user.id,
            p_full_name: formData.fullName
          }),
          signal: undefined
        }
      );

      if (!functionResponse.ok) {
        const errorText = await functionResponse.text();
        throw new Error(errorText || 'Failed to create user profile');
      }

      // Check if email confirmation is required
      // When email confirmation is enabled globally, authData.session will be null
      const requiresConfirmation = !authData.session;
      setNeedsEmailConfirmation(requiresConfirmation);
      setSuccess(true);
      
      if (!requiresConfirmation) {
        // Email confirmation not required - redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
      // If confirmation is required, don't redirect - show message asking them to check email

    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError(err.message || 'Failed to accept invitation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
        <div className="flex flex-col items-center gap-4">
          <Loader className={`animate-spin ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
        <div className={`
          max-w-md w-full rounded-2xl p-8 text-center
          ${theme === 'dark' 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white border border-slate-200 shadow-lg'
          }
        `}>
          <XCircle className={`mx-auto mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} size={48} />
          <h2 className={`text-2xl font-black mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>Invalid Invitation</h2>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600 mb-6'}>
            {error}
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="px-6 py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
        <div className={`
          max-w-md w-full rounded-2xl p-8 text-center
          ${theme === 'dark' 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white border border-slate-200 shadow-lg'
          }
        `}>
          <CheckCircle2 className={`mx-auto mb-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} size={48} />
          <h2 className={`text-2xl font-black mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>Account Created Successfully!</h2>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600 mb-6'}>
            {needsEmailConfirmation ? (
              <>
                Please check your email and click the confirmation link to activate your account.
                <br /><br />
                After confirming your email, you'll be able to log in and access the dashboard.
              </>
            ) : (
              'Your account has been created successfully. Redirecting to dashboard...'
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {theme === 'dark' ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-50/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl"></div>
          </>
        )}
      </div>

      <div className={`
        relative max-w-md w-full rounded-2xl p-8 shadow-2xl
        ${theme === 'dark' 
          ? 'bg-slate-800 border border-slate-700' 
          : 'bg-white border border-slate-200'
        }
      `}>
        <div className="text-center mb-8">
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4
            ${theme === 'dark' 
              ? 'bg-purple-500/20 border border-purple-500/30' 
              : 'bg-purple-100 border border-purple-200'
            }
          `}>
            <Mail className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} size={32} />
          </div>
          <h2 className={`text-3xl font-black mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Accept Invitation
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
            You've been invited to join as <span className="font-bold">{invitation?.role === 'employee' ? 'Employee' : 'HR'}</span>
            {invitation?.job_title && ` • ${invitation.job_title}`}
            {invitation?.team_name && ` • Team: ${invitation.team_name}`}
          </p>
        </div>

        {error && (
          <div className={`
            mb-6 p-4 rounded-xl
            ${theme === 'dark' 
              ? 'bg-red-500/10 border border-red-500/30 text-red-300' 
              : 'bg-red-50 border border-red-200 text-red-700'
            }
          `}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`
                w-full px-4 py-3 rounded-xl border outline-none transition-colors
                ${theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                }
              `}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              value={invitation?.email || ''}
              disabled
              className={`
                w-full px-4 py-3 rounded-xl border outline-none
                ${theme === 'dark'
                  ? 'bg-slate-700/50 border-slate-600 text-slate-400'
                  : 'bg-slate-100 border-slate-200 text-slate-500'
                }
              `}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`
                w-full px-4 py-3 rounded-xl border outline-none transition-colors
                ${theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                }
              `}
              placeholder="Create a password (min. 6 characters)"
              minLength={6}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`
                w-full px-4 py-3 rounded-xl border outline-none transition-colors
                ${theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                }
              `}
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {submitting ? 'Creating Account...' : 'Accept Invitation & Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvite;

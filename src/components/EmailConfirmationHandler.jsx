import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const EmailConfirmationHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userProfile, loading } = useAuth();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Wait for auth to finish loading
      if (loading) {
        return;
      }

      // If user is authenticated, check if they need to complete signup
      if (user) {
        // Check if user has a profile and organization
        if (!userProfile || !userProfile.organization_id) {
          navigate('/complete-signup');
        } else {
          navigate('/dashboard');
        }
      } else {
        // User is not authenticated, redirect to sign in
        navigate('/signin');
      }
    };

    handleEmailConfirmation();
  }, [user, userProfile, loading, navigate]);

  // Show loading state
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-slate-400">Verifying email...</div>
    </div>
  );
};

export default EmailConfirmationHandler;

/**
 * Custom hook to fetch and manage organization data
 * This will be used to get plan info, employee count, etc.
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useOrganization = () => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First, get the user's organization_id from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('organization_id')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;
        if (!userData?.organization_id) {
          setLoading(false);
          return;
        }

        // Get organization details
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', userData.organization_id)
          .single();

        if (orgError) throw orgError;
        setOrganization(orgData);

        // Count employees in this organization
        const { count, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', userData.organization_id)
          .eq('role', 'employee')
          .eq('is_active', true);

        if (countError) throw countError;
        setEmployeeCount(count || 0);

      } catch (err) {
        console.error('Error fetching organization data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, [user]);

  return {
    organization,
    plan: organization?.plan || null,
    employeeCount,
    loading,
    error
  };
};

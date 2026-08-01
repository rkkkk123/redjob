import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

const MOCK_SCANS_KEY = 'redjob_saved_scans';
const MOCK_USER_KEY = 'redjob_demo_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize user & scans
  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        // Live Supabase setup
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          fetchSupabaseScans(session.user.id);
        }
        
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            fetchSupabaseScans(session.user.id);
          } else {
            setUser(null);
            setScans([]);
          }
        });

        setLoading(false);
        return () => authListener?.subscription?.unsubscribe();
      } else {
        // LocalStorage fallback for demo/unconfigured environment
        const savedUser = localStorage.getItem(MOCK_USER_KEY);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            console.error('Failed to parse cached user', e);
          }
        }
        
        const cachedScans = localStorage.getItem(MOCK_SCANS_KEY);
        if (cachedScans) {
          try {
            setScans(JSON.parse(cachedScans));
          } catch (e) {
            console.error('Failed to parse cached scans', e);
          }
        } else {
          // Initialize default mock scan history for demo
          const defaultScans = [
            {
              id: 'demo-1',
              createdAt: new Date().toISOString(),
              roleTitle: 'Senior Product Designer',
              companyName: 'TechNova',
              score: 38,
              summary: "High-stress environment disguised as a 'fast-paced startup'. Expect significant overtime.",
              flags: [
                { severity: 'red', quote: 'Must be willing to wear many hats and hustle.', reason: 'Code for understaffed team.', question: 'What does a typical workweek look like?' }
              ]
            }
          ];
          setScans(defaultScans);
          localStorage.setItem(MOCK_SCANS_KEY, JSON.stringify(defaultScans));
        }
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchSupabaseScans = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('job_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (err) {
      console.error('Error fetching scans from Supabase:', err);
    }
  };

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      // LocalStorage demo login
      const demoUser = { id: 'usr_' + Date.now(), email, name: email.split('@')[0], plan: 'Plus' };
      setUser(demoUser);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(demoUser));
      return { user: demoUser };
    }
  };

  const signup = async (fullName, email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;
      return data;
    } else {
      const demoUser = { id: 'usr_' + Date.now(), email, name: fullName, plan: 'Free' };
      setUser(demoUser);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(demoUser));
      return { user: demoUser };
    }
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) throw error;
    } else {
      const demoUser = { id: 'usr_g_' + Date.now(), email: 'alex.google@example.com', name: 'Alex Johnson', plan: 'Plus' };
      setUser(demoUser);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(demoUser));
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(MOCK_USER_KEY);
      setUser(null);
    }
  };

  const saveScan = async (scanResult) => {
    const newScan = {
      id: scanResult.id || 'scan_' + Date.now(),
      created_at: new Date().toISOString(),
      role_title: scanResult.roleTitle || 'Job Analysis',
      company_name: scanResult.companyName || 'Target Company',
      score: scanResult.score,
      summary: scanResult.summary,
      flags: scanResult.flags || [],
      signals: scanResult.signals || [],
      resume_fit: scanResult.resumeFit || null,
      salary_insights: scanResult.salaryInsights || null,
      interview_strategy: scanResult.interviewStrategy || []
    };

    if (isSupabaseConfigured && supabase && user) {
      try {
        const { error } = await supabase.from('job_scans').insert([{
          user_id: user.id,
          job_title: newScan.role_title,
          company_name: newScan.company_name,
          score: newScan.score,
          summary: newScan.summary,
          flags: newScan.flags,
          signals: newScan.signals,
          resume_match_score: newScan.resume_fit?.matchScore || null
        }]);
        if (error) console.error('Failed to save to Supabase:', error);
      } catch (err) {
        console.error('Supabase save exception:', err);
      }
    }

    // Always update local state for immediate UI feedback
    const updatedScans = [newScan, ...scans];
    setScans(updatedScans);
    localStorage.setItem(MOCK_SCANS_KEY, JSON.stringify(updatedScans));
  };

  const deleteScan = async (scanId) => {
    if (isSupabaseConfigured && supabase && user) {
      await supabase.from('job_scans').delete().eq('id', scanId);
    }
    const updated = scans.filter(s => s.id !== scanId);
    setScans(updated);
    localStorage.setItem(MOCK_SCANS_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      scans,
      login,
      signup,
      loginWithGoogle,
      logout,
      saveScan,
      deleteScan,
      isSupabaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

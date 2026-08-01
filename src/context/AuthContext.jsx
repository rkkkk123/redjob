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

      const formatted = (data || []).map(item => ({
        ...item,
        id: item.id,
        createdAt: item.created_at,
        roleTitle: item.job_title || item.role_title || item.roleTitle || 'Job Analysis',
        companyName: item.company_name || item.companyName || 'Corporate Posting',
        score: item.score || 75,
        summary: item.summary || '',
        flags: item.flags || [],
        signals: item.signals || [],
        resumeFit: item.resume_fit || item.full_data?.resumeFit || null,
        salaryInsights: item.salary_insights || item.full_data?.salaryInsights || null,
        interviewStrategy: item.interview_strategy || item.full_data?.interviewStrategy || [],
        hiringMetrics: item.hiring_metrics || item.full_data?.hiringMetrics || null,
        compensationComparison: item.compensation_comparison || item.full_data?.compensationComparison || null,
        futureProofIndex: item.future_proof_index || item.full_data?.futureProofIndex || null,
        ...(item.full_data || {})
      }));

      setScans(formatted);
    } catch (err) {
      console.error('Error fetching scans from Supabase:', err);
    }
  };

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
        fetchSupabaseScans(data.user.id);
      }
      return data;
    } else {
      // LocalStorage demo login
      const demoUser = { 
        id: 'usr_' + Date.now(), 
        email, 
        name: email.split('@')[0], 
        user_metadata: { full_name: email.split('@')[0] },
        plan: 'Plus' 
      };
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
        options: { data: { full_name: fullName, name: fullName } }
      });
      if (error) throw error;

      const newUser = data.session?.user || data.user;
      if (newUser) {
        setUser(newUser);
        try {
          await supabase.from('profiles').upsert({
            id: newUser.id,
            email: email,
            full_name: fullName,
            updated_at: new Date().toISOString()
          });
        } catch (pErr) {
          console.warn('Profile sync warning:', pErr.message);
        }
      }
      return data;
    } else {
      const demoUser = { 
        id: 'usr_' + Date.now(), 
        email, 
        name: fullName, 
        user_metadata: { full_name: fullName },
        plan: 'Free' 
      };
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
      const demoUser = { 
        id: 'usr_g_' + Date.now(), 
        email: 'alex.google@example.com', 
        name: 'Alex Johnson', 
        user_metadata: { full_name: 'Alex Johnson' },
        plan: 'Plus' 
      };
      setUser(demoUser);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(demoUser));
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
    setScans([]);
  };

  const saveScan = async (scanResult) => {
    const newScan = {
      id: scanResult.id || 'scan_' + Date.now(),
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      role_title: scanResult.roleTitle || 'Job Analysis',
      roleTitle: scanResult.roleTitle || 'Job Analysis',
      company_name: scanResult.companyName || 'Target Company',
      companyName: scanResult.companyName || 'Target Company',
      score: scanResult.score,
      summary: scanResult.summary,
      flags: scanResult.flags || [],
      signals: scanResult.signals || [],
      resume_fit: scanResult.resumeFit || null,
      resumeFit: scanResult.resumeFit || null,
      salary_insights: scanResult.salaryInsights || null,
      salaryInsights: scanResult.salaryInsights || null,
      interview_strategy: scanResult.interviewStrategy || [],
      interviewStrategy: scanResult.interviewStrategy || [],
      hiringMetrics: scanResult.hiringMetrics || null,
      compensationComparison: scanResult.compensationComparison || null,
      futureProofIndex: scanResult.futureProofIndex || null,
      full_data: scanResult
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

    // Update local state and isolated cache for immediate feedback
    const updatedScans = [newScan, ...scans];
    setScans(updatedScans);
    const userStorageKey = user ? `${MOCK_SCANS_KEY}_${user.id}` : MOCK_SCANS_KEY;
    localStorage.setItem(userStorageKey, JSON.stringify(updatedScans));
  };

  const deleteScan = async (scanId) => {
    if (isSupabaseConfigured && supabase && user) {
      await supabase.from('job_scans').delete().eq('id', scanId);
    }
    const updated = scans.filter(s => s.id !== scanId);
    setScans(updated);
    const userStorageKey = user ? `${MOCK_SCANS_KEY}_${user.id}` : MOCK_SCANS_KEY;
    localStorage.setItem(userStorageKey, JSON.stringify(updated));
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

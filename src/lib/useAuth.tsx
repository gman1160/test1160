
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Since we don't want authentication, we just provide a simple API
  // that always returns not authenticated but doesn't cause errors elsewhere
  const signOut = async () => {
    // No-op since we're not using auth
  };

  return {
    session: null,
    user: null,
    isLoading: false,
    signOut,
    isAuthenticated: true, // Always return true to bypass auth checks
  };
};

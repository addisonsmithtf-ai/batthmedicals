import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  version: string;
  content: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const usePolicies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      let query = supabase.from('policies').select('*');
      
      // Staff can only see active policies, admins see all
      if (userRole === 'staff') {
        query = query.eq('status', 'active');
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  const createPolicy = async (policyData: Omit<Policy, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .insert([{ ...policyData, created_by: user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      
      setPolicies(prev => [data, ...prev]);
      toast.success('Policy created successfully');
      return data;
    } catch (error) {
      console.error('Error creating policy:', error);
      toast.error('Failed to create policy');
      throw error;
    }
  };

  const updatePolicy = async (id: string, policyData: Partial<Omit<Policy, 'id' | 'created_at' | 'updated_at' | 'created_by'>>) => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .update(policyData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setPolicies(prev => prev.map(p => p.id === id ? data : p));
      toast.success('Policy updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating policy:', error);
      toast.error('Failed to update policy');
      throw error;
    }
  };

  const deletePolicy = async (id: string) => {
    try {
      const { error } = await supabase
        .from('policies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPolicies(prev => prev.filter(p => p.id !== id));
      toast.success('Policy deleted successfully');
    } catch (error) {
      console.error('Error deleting policy:', error);
      toast.error('Failed to delete policy');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchPolicies();
    }
  }, [user, userRole]);

  return {
    policies,
    loading,
    createPolicy,
    updatePolicy,
    deletePolicy,
    refetch: fetchPolicies
  };
};
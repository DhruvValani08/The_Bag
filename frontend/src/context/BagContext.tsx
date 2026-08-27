import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface LinkItem {
  id: string;
  user_id: string;
  url: string;
  note: string | null;
  category: string | null;
  tags: string[];
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

interface BagContextType {
  links: LinkItem[];
  loading: boolean;
  error: string | null;
  fetchLinks: () => Promise<void>;
  addLink: (url: string, note: string, category: string, tags: string[]) => Promise<void>;
  updateLink: (id: string, updates: Partial<Omit<LinkItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  togglePin: (id: string, currentPinned: boolean) => Promise<void>;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

export const BagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    if (!user) {
      setLinks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (err: any) {
      console.error('Error fetching links:', err);
      setError(err.message || 'Failed to load links.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [user]);

  const addLink = async (url: string, note: string, category: string, tags: string[]) => {
    if (!user) throw new Error('User must be logged in to add links.');
    setError(null);
    try {
      const cleanUrl = url.trim();
      const cleanNote = note.trim() || null;
      const cleanCategory = category.trim() || null;
      const cleanTags = tags.map(t => t.trim().toLowerCase()).filter(t => t.length > 0);

      const { data, error } = await supabase
        .from('links')
        .insert([
          {
            user_id: user.id,
            url: cleanUrl,
            note: cleanNote,
            category: cleanCategory,
            tags: cleanTags,
            pinned: false,
          },
        ])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setLinks(prev => [data[0] as LinkItem, ...prev]);
      }
    } catch (err: any) {
      console.error('Error adding link:', err);
      setError(err.message || 'Failed to add link.');
      throw err;
    }
  };

  const updateLink = async (id: string, updates: Partial<Omit<LinkItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) throw new Error('User must be logged in to update links.');
    setError(null);
    try {
      // Normalize values if present
      const formattedUpdates: any = { ...updates };
      if (formattedUpdates.url !== undefined) formattedUpdates.url = formattedUpdates.url.trim();
      if (formattedUpdates.note !== undefined) formattedUpdates.note = formattedUpdates.note.trim() || null;
      if (formattedUpdates.category !== undefined) formattedUpdates.category = formattedUpdates.category.trim() || null;
      if (formattedUpdates.tags !== undefined) {
        formattedUpdates.tags = formattedUpdates.tags
          .map((t: string) => t.trim().toLowerCase())
          .filter((t: string) => t.length > 0);
      }

      const { data, error } = await supabase
        .from('links')
        .update(formattedUpdates)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setLinks(prev => prev.map(item => (item.id === id ? (data[0] as LinkItem) : item)));
      }
    } catch (err: any) {
      console.error('Error updating link:', err);
      setError(err.message || 'Failed to update link.');
      throw err;
    }
  };

  const deleteLink = async (id: string) => {
    if (!user) throw new Error('User must be logged in to delete links.');
    setError(null);
    try {
      const { error } = await supabase.from('links').delete().eq('id', id);

      if (error) throw error;
      setLinks(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      console.error('Error deleting link:', err);
      setError(err.message || 'Failed to delete link.');
      throw err;
    }
  };

  const togglePin = async (id: string, currentPinned: boolean) => {
    await updateLink(id, { pinned: !currentPinned });
  };

  return (
    <BagContext.Provider
      value={{
        links,
        loading,
        error,
        fetchLinks,
        addLink,
        updateLink,
        deleteLink,
        togglePin,
      }}
    >
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => {
  const context = useContext(BagContext);
  if (context === undefined) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
};

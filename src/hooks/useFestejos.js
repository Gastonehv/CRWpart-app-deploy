import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useFestejos(userId) {
  const [festejos, setFestejos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('festejos')
      .select('*')
      .eq('user_id', userId)
      .order('fecha_tentativa', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setFestejos(data || []);
        setLoading(false);
      });
  }, [userId]);

  return { festejos, loading, error };
}

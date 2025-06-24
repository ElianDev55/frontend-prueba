import { useEffect, useState } from 'react';
import type { ChipsResponse } from '../interfaces/chips.interface';

export const useGetChips = () => {
  const [chips, setChips] = useState<ChipsResponse>({
    data: [],
    date: '',
    status: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChips = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chips`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las papas');
        }

        const data = await response.json();
        setChips(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Algo salió mal');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChips();
  }, []);

  return { chips, loading, error };
};

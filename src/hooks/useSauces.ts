import { useEffect, useState } from 'react';
import type { SaucesResponse } from '../interfaces/sauces.interface';

export const useGetSauces = () => {
  const [sauces, setSauces] = useState<SaucesResponse>({
    data: [],
    date: '',
    status: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSauces = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sauces`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las salsas');
        }

        const data = await response.json();
        setSauces(data);
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

    fetchSauces();
  }, []);

  return { sauces, loading, error };
};

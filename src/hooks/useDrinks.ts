import { useEffect, useState } from 'react';
import type { DrinksResponse } from '../interfaces/drinks.interface';

export const useGetDrinks = () => {
  const [drinks, setDrinks] = useState<DrinksResponse>({
    data: [],
    date: '',
    status: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/drinks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las bebidas');
        }

        const data = await response.json();
        setDrinks(data);
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

    fetchDrinks();
  }, []);

  return { drinks, loading, error };
};

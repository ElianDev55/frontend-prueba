import { useEffect, useState } from 'react';
import type { DishesInterface } from '../interfaces/dishes.interface';

export const useGetDishes = () => {
  const [dishes, setDishes] = useState<DishesInterface>({
    data: [],
    date: '',
    status: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/dishes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los platos');
        }

        const data = await response.json();
        setDishes(data);
      } catch (err: any) {
        setError(err.message || 'Algo salió mal');
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  return { dishes, loading, error };
};

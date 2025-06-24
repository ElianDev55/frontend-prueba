import { useEffect, useState } from 'react';
import type { UserInterface } from '../interfaces/user.interface';

export const useGetUserById = () => {
  const [user, setUser] = useState<UserInterface>({
    data: {
      id: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      created_at: '',
      updated_at: '',
      is_deleted: false,
    },
    date: '',
    status: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${localStorage.getItem('user')}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los platos');
        }

        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Algo salió mal');
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, []);

  return { user, loading, error };
};

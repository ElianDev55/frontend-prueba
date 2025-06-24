import { useEffect, useState } from 'react';
import type { AdditionalProductsResponse } from '../interfaces/additional-products.interface';

export const useGetAdditionalProducts = () => {
  const [additionalProducts, setAdditionalProducts] = useState<AdditionalProductsResponse>({
    data: [],
    date: '',
    status: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdditionalProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/additional-products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los productos adicionales');
        }

        const data = await response.json();
        setAdditionalProducts(data);
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

    fetchAdditionalProducts();
  }, []);

  return { additionalProducts, loading, error };
};

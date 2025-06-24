import { useEffect, useState } from 'react';
import type { BillsByUserResponse } from '../interfaces/bill-by-user.interface';

export const useGetBillsByUser = () => {
  const [bills, setBills] = useState<BillsByUserResponse>({
    data: [],
    date: '',
    status: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillsByUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bills/user/${localStorage.getItem('user')}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los platos');
        }

        const data = await response.json();
        setBills(data);
      } catch (err: any) {
        setError(err.message || 'Algo salió mal');
      } finally {
        setLoading(false);
      }
    };

    fetchBillsByUser();
  }, []);

  return { bills, loading, error };
};

export const usePostBill = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postBill = async (bill: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bill),
      });

      if (!response.ok) {
        throw new Error('Error al crear la factura');
      }
      return response.json();
    } catch (err: any) {
      setError(err.message || 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

  return { postBill, loading, error };
};

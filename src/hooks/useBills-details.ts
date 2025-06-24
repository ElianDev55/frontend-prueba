import { useEffect, useState } from 'react';

export const usePostBillDetails = (bill: any) => {
  const [billDetails, setBillDetails] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const postBillDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/details-dishes`, {
          headers: {
            method: 'POST',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bill),
        });

        if (!response.ok) {
          throw new Error('Error al obtener los platos');
        }

        const data = await response.json();
        setBillDetails(data);
      } catch (err: any) {
        setError(err.message || 'Algo salió mal');
      } finally {
        setLoading(false);
      }
    };

    postBillDetails();
  }, []);

  return { billDetails, loading, error };
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

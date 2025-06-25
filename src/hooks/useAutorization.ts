import { useEffect, useState } from 'react';
import type { LoginInterface } from '../interfaces/login.interface';
import type { RegisterInterface } from '../interfaces/register.interface';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (loginData: LoginInterface) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (registerData: RegisterInterface) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(registerData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json();
          setError(data.message);
          return data;
        }
        throw new Error('Error al iniciar sesión');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message || 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message || 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};

export const useValidateToken = () => {
  const [response, setResponse] = useState<any>([]);
  const [cargar, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/validate-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: localStorage.getItem('token'),
          }),
        });

        if (!response.ok) {
          throw new Error('Error al obtener los platos');
        }

        const data = await response.json();
        setResponse(data);
      } catch (err: any) {
        setError(err.message || 'Algo salió mal');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  return { response, cargar, error };
};

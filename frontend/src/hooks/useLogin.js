import { useState } from 'react';
import { useRouter } from 'next/router';

export function useLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email, password) => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.accessToken);
        router.push('/');
        return true;
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading, setError };
}

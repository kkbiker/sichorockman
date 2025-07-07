import { useState } from 'react';
import { useRouter } from 'next/router';

export function useRegister() {
  const [error, setError] = useState('');
  const router = useRouter();

  const register = async (email, password, passwordConfirm) => {
    setError('');

    if (!email || !password || !passwordConfirm) {
      setError('All fields are required.');
      return false;
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, passwordConfirm }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        router.push('/');
        return true;
      } else {
        setError(data.message || 'Registration failed. Please try again.');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return false;
    }
  };

  return { register, error, setError };
}

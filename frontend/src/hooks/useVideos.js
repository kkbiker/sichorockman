import { useState, useEffect, useCallback } from 'react';

export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVideos = useCallback(async (token, query = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/v1/videos?query=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch videos.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        fetchVideos(token);
      }
    }
  }, [fetchVideos]);

  return { videos, loading, error, fetchVideos, setError };
}

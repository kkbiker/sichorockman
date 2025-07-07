import { useState, useEffect, useCallback } from 'react';

export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVideos = useCallback(async (token, categoryId = null, searchQuery = '') => {
    setLoading(true);
    setError('');
    try {
      let url = `/api/v1/videos?`;
      if (categoryId) {
        url += `categoryId=${categoryId}&`;
      }
      if (searchQuery) {
        url += `q=${searchQuery}&`;
      }
      // Remove trailing '&' if any
      if (url.endsWith('&')) {
        url = url.slice(0, -1);
      }
      const response = await fetch(url, {
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
        fetchVideos(token, null, ''); // Initial fetch without category or search query
      }
    }
  }, [fetchVideos]);

  return { videos, loading, error, fetchVideos, setError };
}

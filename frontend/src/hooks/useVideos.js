import { useState, useEffect, useCallback } from 'react';

export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVideos = useCallback(async (token, categoryId, searchQuery) => {
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
      console.log(url);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched videos data:", data);
        if (Array.isArray(data)) {
          setVideos(data);
          return data; // Return the fetched data
        } else {
          console.error("API returned non-array data for videos:", data);
          setVideos([]); // Ensure videos is always an array
          return []; // Return an empty array if data is not an array
        }
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

  

  const getVideoById = useCallback(async (videoId, token) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/v1/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch video.');
        return null;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { videos, loading, error, fetchVideos, getVideoById, setError };
}

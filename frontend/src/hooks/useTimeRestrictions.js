import { useState, useEffect, useCallback } from 'react';

export function useTimeRestrictions() {
  const [timeRestrictions, setTimeRestrictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTimeRestrictions = useCallback(async (token, categoryId = null) => {
    setLoading(true);
    setError('');
    try {
      let url = '/api/v1/time-restrictions';
      if (categoryId) {
        url += `?categoryId=${categoryId}`;
      }
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTimeRestrictions(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch time restrictions.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTimeRestriction = useCallback(async (restriction) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return false;
      }

      const response = await fetch('/api/v1/time-restrictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(restriction),
      });

      if (response.ok) {
        fetchTimeRestrictions(token); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create time restriction.');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTimeRestrictions]);

  const updateTimeRestriction = useCallback(async (id, restriction) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return false;
      }

      const response = await fetch(`/api/v1/time-restrictions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(restriction),
      });

      if (response.ok) {
        fetchTimeRestrictions(token); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update time restriction.');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTimeRestrictions]);

  const deleteTimeRestriction = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return false;
      }

      const response = await fetch(`/api/v1/time-restrictions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchTimeRestrictions(token); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete time restriction.');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTimeRestrictions]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        fetchTimeRestrictions(token);
        // 1分ごとに更新（必要であれば）
        const intervalId = setInterval(() => fetchTimeRestrictions(token), 60000);
        return () => clearInterval(intervalId);
      }
    }
  }, [fetchTimeRestrictions]);

  return { timeRestrictions, loading, error, createTimeRestriction, updateTimeRestriction, deleteTimeRestriction, fetchTimeRestrictions };
}

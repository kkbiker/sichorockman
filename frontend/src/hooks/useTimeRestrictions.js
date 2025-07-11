import { useState, useEffect, useCallback } from 'react';

export function useTimeRestrictions() {
  const [timeRestrictions, setTimeRestrictions] = useState([]);
  const [activeRestrictions, setActiveRestrictions] = useState([]); // New state for active restrictions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTimeRestrictions = useCallback(async (token) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/time-restrictions', {
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

  // New function to fetch only active restrictions
  const fetchActiveTimeRestrictions = useCallback(async (token) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/time-restrictions/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setActiveRestrictions(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch active time restrictions.');
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
        fetchTimeRestrictions(token); // Refresh full list
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
        fetchTimeRestrictions(token); // Refresh full list
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
        fetchTimeRestrictions(token); // Refresh full list
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

  return { timeRestrictions, activeRestrictions, loading, error, createTimeRestriction, updateTimeRestriction, deleteTimeRestriction, fetchTimeRestrictions, fetchActiveTimeRestrictions };
}

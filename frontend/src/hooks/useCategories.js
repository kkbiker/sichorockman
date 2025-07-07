import { useState, useEffect, useCallback } from 'react';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async (token) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch categories.');
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
        fetchCategories(token);
      }
    }
  }, [fetchCategories]);

  const createCategory = async (name, channelLimit) => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/v1/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, channelLimit }),
      });

      if (response.ok) {
        fetchCategories(token); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create category.');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, name, channelLimit) => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/v1/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, channelLimit }),
      });

      if (response.ok) {
        fetchCategories(token); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update category.');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/v1/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCategories(token); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete category.');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, createCategory, updateCategory, deleteCategory, setError };
}

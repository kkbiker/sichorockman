import { useState, useCallback } from 'react';

export function useChannels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchChannels = useCallback(async (query) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/v1/channels/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChannels(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to search channels.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addChannel = useCallback(async (youtubeChannelId, categoryId) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return false;
      }

      const response = await fetch(`/api/v1/user-channels?youtubeChannelId=${encodeURIComponent(youtubeChannelId)}&categoryId=${categoryId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // 登録成功後の処理（例: チャンネルリストの更新など）
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add channel.');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserChannels = useCallback(async (categoryId = null) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return [];
      }

      let url = `/api/v1/user-channels`;
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
        setChannels(data);
        return data;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch user channels.');
        return [];
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUserChannel = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return false;
      }

      const response = await fetch(`/api/v1/user-channels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // 削除成功後、リストを再取得
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete user channel.');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { channels, loading, error, searchChannels, addChannel, getUserChannels, deleteUserChannel, setError };
}
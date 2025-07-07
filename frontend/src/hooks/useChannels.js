import { useState } from 'react';

export function useChannels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchChannels = async (query) => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/v1/channels/search?q=${query}`, {
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
  };

  const registerChannel = async (channel) => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        return;
      }

      const response = await fetch('/api/v1/user-channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          youtubeChannelId: channel.youtubeChannelId,
          name: channel.name,
          description: channel.description,
          thumbnailUrl: channel.thumbnailUrl,
        }),
      });

      if (response.ok) {
        alert('チャンネルが登録されました！');
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'チャンネル登録に失敗しました。');
        return false;
      }
    } catch (err) {
      setError('ネットワークエラー。後でもう一度お試しください。');
      return false;
    }
  };

  return { channels, loading, error, searchChannels, registerChannel, setError };
}

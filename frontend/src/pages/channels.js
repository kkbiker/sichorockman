import { useState } from 'react';
import { useChannels } from '../hooks/useChannels';
import styles from '../styles/channels.module.css';

export default function Channels() {
  const { channels, loading, error, searchChannels, registerChannel, setError } = useChannels();
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    await searchChannels(query);
  };

  const handleRegister = async (channel) => {
    await registerChannel(channel);
  };

  return (
    <div className={styles['channels-container']}>
      <h1 className={styles['channels-title']}>チャンネル検索・登録</h1>
      <div className={styles['search-container']}>
        <input
          type="text"
          placeholder="チャンネル名で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className={styles['search-input']}
        />
        <button onClick={handleSearch} disabled={loading} className={styles['search-button']}>
          {loading ? '検索中...' : '検索'}
        </button>
      </div>

      {error && <p className={styles['error-message']}>{error}</p>}

      <div className={styles['channel-list']}>
        {channels.map((channel) => (
          <div key={channel.youtubeChannelId} className={styles['channel-card']}>
            <img className={styles['channel-thumbnail']} src={channel.thumbnailUrl} alt={channel.name} />
            <h3 className={styles['channel-name']}>{channel.name}</h3>
            <p className={styles['channel-description']}>{channel.description}</p>
            <button onClick={() => handleRegister(channel)} className={`${styles.button} ${styles['register-button']}`}>
              登録
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useChannels } from '../hooks/useChannels';
import { useCategories } from '../hooks/useCategories';
import styles from '../styles/channels.module.css';
import Link from 'next/link';

export default function Channels() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { searchChannels, addChannel, channels, loading, error } = useChannels();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchChannels(searchQuery);
    }
  };

  const handleAddChannel = async (youtubeChannelId) => {
    if (!selectedCategory) {
      alert('カテゴリを選択してください。');
      return;
    }
    const success = await addChannel(youtubeChannelId, selectedCategory);
    if (success) {
      alert('チャンネルを登録しました！');
      // 登録後、検索結果をクリアするか、更新するかは要検討
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>チャンネル管理</h1>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="🔍 チャンネル名またはURLを入力"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" disabled={loading} className={styles.searchButton}>
          {loading ? '検索中...' : '検索'}
        </button>
      </form>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {categoriesError && <p className={styles.errorMessage}>{categoriesError}</p>}

      <div className={styles.searchResults}>
        {loading ? (
          <p>検索中...</p>
        ) : (
          channels.map((channel) => (
            <div key={channel.youtubeChannelId} className={styles.channelCard}>
              <img src={channel.thumbnailUrl} alt={channel.name} className={styles.channelThumbnail} />
              <div className={styles.channelInfo}>
                <h3>{channel.name}</h3>
                <p>{channel.description}</p>
                {/* TODO: 登録者数、動画数の表示 */}
              </div>
              <div className={styles.channelActions}>
                {categoriesLoading ? (
                  <p>カテゴリ読み込み中...</p>
                ) : (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={styles.categorySelect}
                  >
                    <option value="">カテゴリを選択</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() => handleAddChannel(channel.youtubeChannelId)}
                  disabled={loading || !selectedCategory}
                  className={styles.addButton}
                >
                  このチャンネルを登録
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

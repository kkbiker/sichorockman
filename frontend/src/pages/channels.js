import { useState, useEffect } from 'react';
import { useChannels } from '../hooks/useChannels';
import { useCategories } from '../hooks/useCategories';
import ChannelConfirmDialog from '../components/ChannelConfirmDialog';
import styles from '../styles/channels.module.css';

export default function Channels() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { searchChannels, addChannel, channels, loading, error, getUserChannels, deleteUserChannel } = useChannels();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [channelToConfirm, setChannelToConfirm] = useState(null);
  const [currentChannelCounts, setCurrentChannelCounts] = useState({});
  const [registeredChannels, setRegisteredChannels] = useState({}); // 登録済みチャンネルをカテゴリごとに保持
  const [hasSearched, setHasSearched] = useState(false); // 検索が実行されたかどうか

  // 登録済みチャンネルの取得とカテゴリごとのグループ化
  useEffect(() => {
    const fetchRegisteredChannels = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const userChannels = await getUserChannels();
        const groupedChannels = {};
        const counts = {};
        userChannels.forEach(uc => {
          if (uc.category && uc.category.id) {
            if (!groupedChannels[uc.category.id]) {
              groupedChannels[uc.category.id] = [];
            }
            groupedChannels[uc.category.id].push(uc);
            counts[uc.category.id] = (counts[uc.category.id] || 0) + 1;
          }
        });
        setRegisteredChannels(groupedChannels);
        setCurrentChannelCounts(counts);
      }
    };
    fetchRegisteredChannels();
  }, [getUserChannels]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true); // 検索が実行された
    if (searchQuery.trim()) {
      await searchChannels(searchQuery);
    } else {
      // 検索クエリが空の場合は検索結果をクリア
      searchChannels('');
    }
  };

  const handleAddChannelClick = (channel) => {
    if (!selectedCategory) {
      alert('カテゴリを選択してください。');
      return;
    }
    setChannelToConfirm(channel);
    setShowConfirmDialog(true);
  };

  const handleConfirmAddChannel = async () => {
    const success = await addChannel(channelToConfirm.youtubeChannelId, selectedCategory);
    if (success) {
      alert('チャンネルを登録しました！');
      setShowConfirmDialog(false);
      setChannelToConfirm(null);
      // 登録後、チャンネル数を再取得
      const token = localStorage.getItem('token');
      if (token) {
        const userChannels = await getUserChannels();
        const groupedChannels = {};
        const counts = {};
        userChannels.forEach(uc => {
          if (uc.category && uc.category.id) {
            if (!groupedChannels[uc.category.id]) {
              groupedChannels[uc.category.id] = [];
            }
            groupedChannels[uc.category.id].push(uc);
            counts[uc.category.id] = (counts[uc.category.id] || 0) + 1;
          }
        });
        setRegisteredChannels(groupedChannels);
        setCurrentChannelCounts(counts);
      }
    }
  };

  const handleCancelAddChannel = () => {
    setShowConfirmDialog(false);
    setChannelToConfirm(null);
  };

  const handleDeleteRegisteredChannel = async (id) => {
    if (window.confirm('このチャンネルの登録を解除しますか？')) {
      const success = await deleteUserChannel(id);
      if (success) {
        alert('チャンネルの登録を解除しました。');
        // 削除後、チャンネル数を再取得
        const token = localStorage.getItem('token');
        if (token) {
          const userChannels = await getUserChannels();
          const groupedChannels = {};
          const counts = {};
          userChannels.forEach(uc => {
            if (uc.category && uc.category.id) {
              if (!groupedChannels[uc.category.id]) {
                groupedChannels[uc.category.id] = [];
              }
              groupedChannels[uc.category.id].push(uc);
              counts[uc.category.id] = (counts[uc.category.id] || 0) + 1;
            }
          });
          setRegisteredChannels(groupedChannels);
          setCurrentChannelCounts(counts);
        }
      }
    }
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === parseInt(categoryId));
  };

  const selectedCategoryObject = getCategoryById(selectedCategory);
  const currentCount = selectedCategoryObject ? (currentChannelCounts[selectedCategoryObject.id] || 0) : 0;
  const channelLimit = selectedCategoryObject ? selectedCategoryObject.channelLimit : 0;

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

      {/* 検索結果表示部分 */}
      {hasSearched && (
        <div className={styles.searchResults}>
          <h2>検索結果</h2>
          {loading ? (
            <p>検索中...</p>
          ) : channels.length > 0 ? (
            channels.map((channel) => (
              <div key={channel.youtubeChannelId} className={styles.channelCard}>
                <img src={channel.thumbnailUrl} alt={channel.name} className={styles.channelThumbnail} />
                <div className={styles.channelInfo}>
                  <h3>{channel.name}</h3>
                  <p>チャンネル登録者数: {channel.subscriberCount ? channel.subscriberCount.toLocaleString() : 'N/A'}人</p>
                  <p>動画数: {channel.videoCount ? channel.videoCount.toLocaleString() : 'N/A'}本</p>
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
                    onClick={() => handleAddChannelClick(channel)}
                    disabled={loading || !selectedCategory}
                    className={styles.addButton}
                  >
                    このチャンネルを登録
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>検索結果が見つかりませんでした。</p>
          )}
        </div>
      )}

      {/* 登録済みチャンネル表示部分 */}
      <div className={styles.registeredChannels}>
        <h2>登録済みチャンネル</h2>
        {categoriesLoading ? (
          <p>カテゴリ読み込み中...</p>
        ) : (
          categories.map(category => (
            <div key={category.id} className={styles.registeredCategorySection}>
              <h3>
                【{category.name}】 ({currentChannelCounts[category.id] || 0}/{category.channelLimit})
              </h3>
              {registeredChannels[category.id] && registeredChannels[category.id].length > 0 ? (
                <ul className={styles.registeredChannelList}>
                  {registeredChannels[category.id].map(userChannel => (
                    <li key={userChannel.id} className={styles.registeredChannelItem}>
                      <img src={userChannel.channel.thumbnailUrl} alt={userChannel.channel.name} className={styles.registeredChannelThumbnail} />
                      <div className={styles.registeredChannelInfo}>
                        <h4>{userChannel.channel.name}</h4>
                      </div>
                      <button 
                        onClick={() => handleDeleteRegisteredChannel(userChannel.id)}
                        className={styles.deleteRegisteredChannelButton}
                      >
                        削除
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>このカテゴリにはチャンネルが登録されていません。</p>
              )}
            </div>
          ))
        )}
      </div>

      {showConfirmDialog && (
        <ChannelConfirmDialog
          channel={channelToConfirm}
          category={selectedCategoryObject}
          currentChannelCount={currentCount}
          channelLimit={channelLimit}
          onConfirm={handleConfirmAddChannel}
          onCancel={handleCancelAddChannel}
        />
      )}
    </div>
  );
}

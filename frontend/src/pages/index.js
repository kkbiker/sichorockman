import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { useVideos } from '../hooks/useVideos';
import { useCategories } from '../hooks/useCategories';
import { useTimeRestrictions } from '../hooks/useTimeRestrictions';
import { useChannels } from '../hooks/useChannels';
import styles from '../styles/index.module.css';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const { videos, loading: videosLoading, error: videosError, fetchVideos } = useVideos();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { activeRestrictions, loading: restrictionsLoading, error: restrictionsError, fetchActiveTimeRestrictions } = useTimeRestrictions();
  const { channels, getUserChannels } = useChannels();
  const [time, setTime] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 10000); // Update every 10 seconds
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Fetch active restrictions periodically
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchActiveTimeRestrictions(token);
      const intervalId = setInterval(() => {
        fetchActiveTimeRestrictions(token);
      }, 60000); // Fetch every minute
      return () => clearInterval(intervalId);
    }
  }, [fetchActiveTimeRestrictions]);

  // Fetch videos when active category or search query changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && activeCategory) {
      fetchVideos(token, activeCategory, searchQuery);
      getUserChannels(activeCategory);
    }
  }, [activeCategory, searchQuery, fetchVideos, getUserChannels]);

  const isCategoryRestricted = (categoryId) => {
    return activeRestrictions && activeRestrictions.some(restriction => restriction.category.id === categoryId);
  };

  const currentActiveCategoryName = categories.find(c => c.id === activeCategory)?.name;
  const headerActiveCategoryDisplay = currentActiveCategoryName ? 
    (isCategoryRestricted(activeCategory) ? `${currentActiveCategoryName} (制限中)` : currentActiveCategoryName) 
    : 'N/A';

  const handleVideoClick = (video) => {
    if (isCategoryRestricted(activeCategory)) {
      alert('このカテゴリは現在、時間制限により視聴できません。');
      return;
    }
    router.push(`/video/${video.youtubeVideoId}`);
  };

  if (!isLoggedIn) {
    return null; // Or a loading spinner
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>視聴ロックマン</title>
        <meta name="description" content="YouTube視聴制限アプリケーション" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>視聴ロックマン</div>
        <div className={styles.headerInfo}>
          <span>現在時刻: {time}</span>
          <span>アクティブ: {headerActiveCategoryDisplay}</span>
        </div>
        <div className={styles.settings}>
          <Link href="/settings"><button className={styles.settingsButton}>設定</button></Link>
        </div>
      </header>

      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <h3>カテゴリ一覧</h3>
          {(categoriesLoading || restrictionsLoading) ? (
            <p>読み込み中...</p>
          ) : (
            <ul>
              {categories.map(category => (
                <li 
                  key={category.id} 
                  className={`${styles.categoryItem} ${isCategoryRestricted(category.id) ? styles.restrictedCategory : ''} ${category.id === activeCategory ? styles.activeCategory : styles.inactiveCategory}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.id === activeCategory ? '✓ ' : ''}{category.name}
                  {isCategoryRestricted(category.id) && ' (制限中)'}
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className={styles.content}>
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="🔍 検索" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {(videosLoading || restrictionsLoading) && <p>動画を読み込み中...</p>}
          {(videosError || categoriesError || restrictionsError) && <p className={styles.error}>{videosError || categoriesError || restrictionsError}</p>}
          <div className={styles.videoGrid}>
            {videos.map((video) => (
              <div 
                key={video.youtubeVideoId} 
                className={`${styles.videoCard} ${isCategoryRestricted(activeCategory) ? styles.videoCardRestricted : ''}`}
                onClick={() => handleVideoClick(video)}
              >
                <img src={video.thumbnailUrl} alt={video.title} />
                <h4>{video.title}</h4>
                <p>{video.channelTitle}</p>
                <p>{new Date(video.publishedAt).toLocaleDateString()}</p>
                {isCategoryRestricted(activeCategory) && (
                  <div className={styles.restrictionOverlay}>
                    <span>視聴制限中</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <footer className={styles.footer}>
        <span>© 2025 視聴ロックマン</span>
        <div>
          <Link href="/settings"><button className={styles.settingsButton}>設定</button></Link>
          <button onClick={logout} className={styles.logoutButton}>ログアウト</button>
        </div>
      </footer>
    </div>
  );
}

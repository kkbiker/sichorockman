import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/settings.module.css';
import ChannelsPage from './channels'; // チャンネル管理ページをインポート
import TimeRestrictionsPage from './time-restrictions'; // 時間制限設定ページをインポート
import CategoriesPage from './categories'; // カテゴリ管理ページをインポート

export default function Settings() {
  const [activeTab, setActiveTab] = useState('channels'); // 初期アクティブタブ

  const renderContent = () => {
    switch (activeTab) {
      case 'channels':
        return <ChannelsPage isEmbedded={true} />; // 埋め込みモードで渡す
      case 'time-restrictions':
        return <TimeRestrictionsPage isEmbedded={true} />; // 埋め込みモードで渡す
      case 'categories':
        return <CategoriesPage isEmbedded={true} />; // 埋め込みモードで渡す
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>視聴ロックマン - 設定</h1>
        <Link href="/">
          <button className={styles.backButton}>← メインに戻る</button>
        </Link>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'channels' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('channels')}
        >
          チャンネル管理
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'time-restrictions' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('time-restrictions')}
        >
          時間制限設定
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'categories' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          カテゴリ管理
        </button>
      </nav>

      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}

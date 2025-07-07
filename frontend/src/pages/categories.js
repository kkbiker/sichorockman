import { useState, useEffect } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useChannels } from '../hooks/useChannels';
import styles from '../styles/categories.module.css';

export default function Categories({ isEmbedded }) {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory, setError } = useCategories();
  const { channels: userChannels, getUserChannels } = useChannels(); // userChannelsとしてリネーム
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newChannelLimit, setNewChannelLimit] = useState(10);
  const [editingCategory, setEditingCategory] = useState(null);
  const [channelCounts, setChannelCounts] = useState({}); // カテゴリごとのチャンネル数を保持

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserChannels(); // 全てのユーザーチャンネルを取得
    }
  }, [getUserChannels]);

  useEffect(() => {
    // userChannelsが更新されたらチャンネル数を集計
    const counts = {};
    userChannels.forEach(userChannel => {
      if (userChannel.category && userChannel.category.id) {
        counts[userChannel.category.id] = (counts[userChannel.category.id] || 0) + 1;
      }
    });
    setChannelCounts(counts);
  }, [userChannels]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const success = await createCategory(newCategoryName, newChannelLimit);
    if (success) {
      setNewCategoryName('');
      setNewChannelLimit(10);
    }
  };

  const handleUpdateCategory = async (id, newName, newLimit) => {
    const success = await updateCategory(id, newName, newLimit);
    if (success) {
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
  };

  return (
    <div className={isEmbedded ? styles.embeddedContainer : styles.container}>
      <h1 className={styles.title}>カテゴリ管理</h1>

      <form className={styles['category-form']} onSubmit={handleCreateCategory}>
        <input
          type="text"
          placeholder="新しいカテゴリ名"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="number"
          placeholder="チャンネル上限"
          value={newChannelLimit}
          onChange={(e) => setNewChannelLimit(parseInt(e.target.value))}
          required
          min="1"
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? '追加中...' : '追加'}
        </button>
      </form>

      {error && <p className={styles['error-message']}>{error}</p>}

      <h2 className={styles.subtitle}>登録済みカテゴリ</h2>
      <table className={styles.categoryTable}>
        <thead>
          <tr>
            <th>カテゴリ名</th>
            <th>チャンネル上限</th>
            <th>登録チャンネル数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                {editingCategory && editingCategory.id === category.id ? (
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateCategory(editingCategory.id, editingCategory.name, editingCategory.channelLimit);
                      }
                    }}
                    className={styles.input}
                  />
                ) : (
                  <span>{category.name}</span>
                )}
              </td>
              <td>
                {editingCategory && editingCategory.id === category.id ? (
                  <input
                    type="number"
                    value={editingCategory.channelLimit}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, channelLimit: parseInt(e.target.value) })
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateCategory(editingCategory.id, editingCategory.name, editingCategory.channelLimit);
                      }
                    }}
                    min="1"
                    className={styles.input}
                  />
                ) : (
                  <span>{category.channelLimit}</span>
                )}
              </td>
              <td>{channelCounts[category.id] || 0}</td>
              <td>
                {editingCategory && editingCategory.id === category.id ? (
                  <>
                    <button
                      onClick={() =>
                        handleUpdateCategory(editingCategory.id, editingCategory.name, editingCategory.channelLimit)
                      }
                      disabled={loading}
                      className={`${styles.button} ${styles['edit-button']}`}
                    >
                      更新
                    </button>
                    <button onClick={() => setEditingCategory(null)} disabled={loading} className={styles.button}>
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingCategory(category)}
                      disabled={loading}
                      className={`${styles.button} ${styles['edit-button']}`}
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={loading}
                      className={`${styles.button} ${styles['delete-button']}`}
                    >
                      削除
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

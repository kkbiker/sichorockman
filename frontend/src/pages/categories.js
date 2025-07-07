import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import styles from '../styles/categories.module.css';
// import Link from 'next/link'; // Linkはsettings.jsで管理するため削除

export default function Categories({ isEmbedded }) { // isEmbeddedプロパティを追加
  const { categories, loading, error, createCategory, updateCategory, deleteCategory, setError } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newChannelLimit, setNewChannelLimit] = useState(10); // channelLimitのstateを追加
  const [editingCategory, setEditingCategory] = useState(null);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const success = await createCategory(newCategoryName, newChannelLimit); // channelLimitを渡す
    if (success) {
      setNewCategoryName('');
      setNewChannelLimit(10); // リセット
    }
  };

  const handleUpdateCategory = async (id, newName, newLimit) => { // newLimitを追加
    const success = await updateCategory(id, newName, newLimit);
    if (success) {
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
  };

  return (
    <div className={isEmbedded ? styles.embeddedContainer : styles.container}> {/* isEmbeddedに応じてスタイルを切り替え */}
      {/* isEmbeddedがtrueの場合は戻るボタンを非表示 */}
      {!isEmbedded && (
        <Link href="/">
          <button className={styles.backButton}>← メインに戻る</button>
        </Link>
      )}
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

      <ul className={styles['category-list']}>
        {categories.map((category) => (
          <li key={category.id} className={styles['category-item']}>
            {editingCategory && editingCategory.id === category.id ? (
              <>
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
              </>
            ) : (
              <span className={styles['category-name']}>{category.name} (上限: {category.channelLimit})</span>
            )}
            <div className={styles['action-buttons']}>
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
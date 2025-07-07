import { useState, useEffect } from 'react';
import { useTimeRestrictions } from '../hooks/useTimeRestrictions';
import { useCategories } from '../hooks/useCategories';
import styles from '../styles/time-restrictions.module.css';
import Link from 'next/link';

const daysOfWeek = [
  { value: 1, label: '月曜日' },
  { value: 2, label: '火曜日' },
  { value: 3, label: '水曜日' },
  { value: 4, label: '木曜日' },
  { value: 5, label: '金曜日' },
  { value: 6, label: '土曜日' },
  { value: 7, label: '日曜日' },
];

const generateTimeOptions = () => {
  const options = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 10) { // 10分間隔
      const hour = String(i).padStart(2, '0');
      const minute = String(j).padStart(2, '0');
      options.push(`${hour}:${minute}`);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export default function TimeRestrictions() {
  const { 
    timeRestrictions, 
    loading, 
    error, 
    createTimeRestriction, 
    updateTimeRestriction, 
    deleteTimeRestriction, 
    fetchTimeRestrictions 
  } = useTimeRestrictions();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  const [newRestriction, setNewRestriction] = useState({
    categoryId: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
  });
  const [editingRestriction, setEditingRestriction] = useState(null);

  useEffect(() => {
    if (categories.length > 0 && !newRestriction.categoryId) {
      setNewRestriction(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, newRestriction.categoryId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const success = await createTimeRestriction(newRestriction);
    if (success) {
      setNewRestriction({
        categoryId: categories.length > 0 ? categories[0].id : '',
        dayOfWeek: '',
        startTime: '',
        endTime: '',
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const success = await updateTimeRestriction(editingRestriction.id, editingRestriction);
    if (success) {
      setEditingRestriction(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('この時間制限を削除しますか？')) {
      await deleteTimeRestriction(id);
    }
  };

  if (categoriesLoading || loading) return <p>読み込み中...</p>;
  if (error || categoriesError) return <p className={styles.errorMessage}>{error || categoriesError}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>時間制限設定</h1>

      <form onSubmit={editingRestriction ? handleUpdate : handleCreate} className={styles.form}>
        <select
          value={editingRestriction ? editingRestriction.categoryId : newRestriction.categoryId}
          onChange={(e) => 
            editingRestriction 
              ? setEditingRestriction(prev => ({ ...prev, categoryId: e.target.value }))
              : setNewRestriction(prev => ({ ...prev, categoryId: e.target.value }))
          }
          required
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={editingRestriction ? editingRestriction.dayOfWeek : newRestriction.dayOfWeek}
          onChange={(e) => 
            editingRestriction 
              ? setEditingRestriction(prev => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))
              : setNewRestriction(prev => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))
          }
          required
        >
          <option value="">曜日を選択</option>
          {daysOfWeek.map(day => (
            <option key={day.value} value={day.value}>{day.label}</option>
          ))}
        </select>

        <select
          value={editingRestriction ? editingRestriction.startTime : newRestriction.startTime}
          onChange={(e) => 
            editingRestriction 
              ? setEditingRestriction(prev => ({ ...prev, startTime: e.target.value }))
              : setNewRestriction(prev => ({ ...prev, startTime: e.target.value }))
          }
          required
        >
          <option value="">開始時間</option>
          {timeOptions.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

        <select
          value={editingRestriction ? editingRestriction.endTime : newRestriction.endTime}
          onChange={(e) => 
            editingRestriction 
              ? setEditingRestriction(prev => ({ ...prev, endTime: e.target.value }))
              : setNewRestriction(prev => ({ ...prev, endTime: e.target.value }))
          }
          required
        >
          <option value="">終了時間</option>
          {timeOptions.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {editingRestriction ? '更新' : '追加'}
        </button>
      </form>

      <h2 className={styles.subtitle}>登録済み時間制限</h2>
      <ul className={styles.restrictionList}>
        {timeRestrictions.map(restriction => (
          <li key={restriction.id} className={styles.restrictionItem}>
            <span>
              {categories.find(cat => cat.id === restriction.category.id)?.name} - 
              {daysOfWeek.find(day => day.value === restriction.dayOfWeek)?.label}: 
              {restriction.startTime} - {restriction.endTime}
            </span>
            <div>
              <button onClick={() => setEditingRestriction(restriction)}>編集</button>
              <button onClick={() => handleDelete(restriction.id)}>削除</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

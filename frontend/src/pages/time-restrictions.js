import { useState, useEffect, useCallback } from 'react';
import { useTimeRestrictions } from '../hooks/useTimeRestrictions';
import { useCategories } from '../hooks/useCategories';
import styles from '../styles/time-restrictions.module.css';

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

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [editingRestriction, setEditingRestriction] = useState(null); // 編集中の時間制限
  const [newRestrictionForm, setNewRestrictionForm] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (selectedCategoryId) {
      const token = localStorage.getItem('token');
      if (token) {
        if (token) {
        fetchTimeRestrictions(token, selectedCategoryId); // カテゴリIDを渡して時間制限を取得
      }
      }
    }
  }, [selectedCategoryId, fetchTimeRestrictions]);

  const handleEditClick = (restriction) => {
    setEditingRestriction(restriction);
    setNewRestrictionForm({
      dayOfWeek: restriction.dayOfWeek,
      startTime: restriction.startTime, // 文字列としてそのまま使用
      endTime: restriction.endTime,     // 文字列としてそのまま使用
    });
  };

  const handleAddClick = (dayOfWeek) => {
    setEditingRestriction(null);
    setNewRestrictionForm({
      dayOfWeek: dayOfWeek,
      startTime: '',
      endTime: '',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const restrictionData = {
      categoryId: selectedCategoryId,
      dayOfWeek: newRestrictionForm.dayOfWeek,
      startTime: newRestrictionForm.startTime,
      endTime: newRestrictionForm.endTime,
    };

    let success = false;
    if (editingRestriction) {
      success = await updateTimeRestriction(editingRestriction.id, restrictionData);
    } else {
      success = await createTimeRestriction(restrictionData);
    }

    if (success) {
      setEditingRestriction(null);
      setNewRestrictionForm({
        dayOfWeek: '',
        startTime: '',
        endTime: '',
      });
      fetchTimeRestrictions(token, selectedCategoryId); // リストを再取得
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('この時間制限を削除しますか？')) {
      const token = localStorage.getItem('token');
      if (token) {
        const success = await deleteTimeRestriction(id);
        if (success) {
          fetchTimeRestrictions(token, selectedCategoryId); // リストを再取得
        }
      }
    }
  };

  const getRestrictionForDay = (dayValue) => {
    return timeRestrictions.find(tr => tr.dayOfWeek === dayValue);
  };

  if (categoriesLoading || loading) return <p>読み込み中...</p>;
  if (error || categoriesError) return <p className={styles.errorMessage}>{error || categoriesError}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>時間制限設定</h1>

      <div className={styles.categorySelectContainer}>
        <label htmlFor="category-select">カテゴリ:</label>
        <select
          id="category-select"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className={styles.select}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <table className={styles.restrictionTable}>
        <thead>
          <tr>
            <th>曜日</th>
            <th>開始時間</th>
            <th>終了時間</th>
            <th>設定状態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map(day => {
            const restriction = getRestrictionForDay(day.value);
            const isEditingThisDay = editingRestriction && editingRestriction.dayOfWeek === day.value;
            const isAddingThisDay = !editingRestriction && newRestrictionForm.dayOfWeek === day.value;

            return (
              <tr key={day.value}>
                <td>{day.label}</td>
                <td>
                  {isEditingThisDay || isAddingThisDay ? (
                    <select
                      value={newRestrictionForm.startTime}
                      onChange={(e) => setNewRestrictionForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className={styles.select}
                    >
                      <option value="">--:--</option>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  ) : (
                    <span>{restriction ? restriction.startTime : '設定なし'}</span>
                  )}
                </td>
                <td>
                  {isEditingThisDay || isAddingThisDay ? (
                    <select
                      value={newRestrictionForm.endTime}
                      onChange={(e) => setNewRestrictionForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className={styles.select}
                    >
                      <option value="">--:--</option>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  ) : (
                    <span>{restriction ? restriction.endTime : '設定なし'}</span>
                  )}
                </td>
                <td>{restriction ? '有効' : '無効'}</td>
                <td>
                  {isEditingThisDay || isAddingThisDay ? (
                    <>
                      <button onClick={handleSave} className={styles.saveButton} disabled={loading}>
                        保存
                      </button>
                      <button onClick={() => { setEditingRestriction(null); setNewRestrictionForm({ dayOfWeek: '', startTime: '', endTime: '' }); }} className={styles.cancelButton} disabled={loading}>
                        キャンセル
                      </button>
                    </>
                  ) : (
                    restriction ? (
                      <>
                        <button onClick={() => handleEditClick(restriction)} className={styles.editButton}>
                          編集
                        </button>
                        <button onClick={() => handleDelete(restriction.id)} className={styles.deleteButton}>
                          削除
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleAddClick(day.value)} className={styles.addButton}>
                        追加
                      </button>
                    )
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
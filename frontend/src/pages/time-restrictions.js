import { useState, useEffect } from 'react';
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

  const [editingRestriction, setEditingRestriction] = useState(null); // 編集中の時間制限 { categoryId, dayOfWeek, ... }
  const [newRestrictionForm, setNewRestrictionForm] = useState({
    categoryId: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTimeRestrictions(token);
    }
  }, [fetchTimeRestrictions]);

  const handleEditClick = (restriction) => {
    setEditingRestriction(restriction);
    setNewRestrictionForm({
      categoryId: restriction.category.id,
      dayOfWeek: restriction.dayOfWeek,
      startTime: restriction.startTime,
      endTime: restriction.endTime,
    });
  };

  const handleAddClick = (categoryId, dayOfWeek) => {
    setEditingRestriction(null);
    setNewRestrictionForm({
      categoryId: categoryId,
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
      categoryId: newRestrictionForm.categoryId,
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
      setNewRestrictionForm({ categoryId: '', dayOfWeek: '', startTime: '', endTime: '' });
      fetchTimeRestrictions(token); // リストを再取得
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('この時間制限を削除しますか？')) {
      const token = localStorage.getItem('token');
      if (token) {
        const success = await deleteTimeRestriction(id);
        if (success) {
          fetchTimeRestrictions(token); // リストを再取得
        }
      }
    }
  };

  const getRestrictionForDay = (categoryId, dayValue) => {
    return timeRestrictions.find(tr => tr.category.id === categoryId && tr.dayOfWeek === dayValue);
  };

  if (categoriesLoading || loading) return <p>読み込み中...</p>;
  if (error || categoriesError) return <p className={styles.errorMessage}>{error || categoriesError}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>時間制限設定</h1>

      {categories.map(category => (
        <div key={category.id} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>{category.name}</h2>
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
                const restriction = getRestrictionForDay(category.id, day.value);
                const isEditingThisDay = editingRestriction && editingRestriction.category.id === category.id && editingRestriction.dayOfWeek === day.value;
                const isAddingThisDay = !editingRestriction && newRestrictionForm.categoryId === category.id && newRestrictionForm.dayOfWeek === day.value;

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
                          <button onClick={() => { setEditingRestriction(null); setNewRestrictionForm({ categoryId: '', dayOfWeek: '', startTime: '', endTime: '' }); }} className={styles.cancelButton} disabled={loading}>
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
                          <button onClick={() => handleAddClick(category.id, day.value)} className={styles.addButton}>
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
      ))}
    </div>
  );
}

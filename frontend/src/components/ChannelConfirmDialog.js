import React from 'react';
import styles from '../styles/ChannelConfirmDialog.module.css';

export default function ChannelConfirmDialog({
  channel,
  category,
  currentChannelCount,
  channelLimit,
  onConfirm,
  onCancel,
}) {
  if (!channel || !category) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2 className={styles.title}>チャンネル登録確認</h2>
        <p className={styles.message}>
          <span className={styles.channelName}>{channel.name}</span>
          を「<span className={styles.categoryName}>{category.name}</span>」カテゴリに登録しますか？
        </p>
        <p className={styles.count}>現在の登録数: {currentChannelCount}/{channelLimit}</p>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelButton}>キャンセル</button>
          <button onClick={onConfirm} className={styles.confirmButton}>登録する</button>
        </div>
      </div>
    </div>
  );
}

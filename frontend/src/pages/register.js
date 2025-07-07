import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import styles from '../styles/register.module.css';
import Link from 'next/link'; // Linkをインポート

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false); // パスワード表示/非表示の状態
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 確認用パスワード表示/非表示の状態
  const { register, error, loading, setError } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !passwordConfirm) {
      setError('すべてのフィールドを入力してください。');
      return;
    }
    if (password !== passwordConfirm) {
      setError('パスワードと確認用パスワードが一致しません。');
      return;
    }
    // TODO: パスワード強度チェック
    await register(email, password, passwordConfirm);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>新規ユーザー登録</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '非表示' : '表示'}
            </button>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="passwordConfirm">Password（確認）</label>
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              id="passwordConfirm"
              placeholder="Password（確認）"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className={styles.input}
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            >
              {showPasswordConfirm ? '非表示' : '表示'}
            </button>
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? '登録中...' : '登録'}
          </button>
        </form>
        <p className={styles.linkText}>
          既にアカウントをお持ちの方は → <Link href="/login">ログイン</Link>
        </p>
      </div>
    </div>
  );
}
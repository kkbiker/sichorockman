import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import styles from '../styles/login.module.css';
import Link from 'next/link'; // Linkをインポート

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // パスワード表示/非表示の状態
  const { login, error, loading, setError } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    await login(email, password);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>視聴ロックマン</h1>
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
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        <p className={styles.linkText}>
          アカウントをお持ちでない方は → <Link href="/register">新規登録</Link>
        </p>
      </div>
    </div>
  );
}
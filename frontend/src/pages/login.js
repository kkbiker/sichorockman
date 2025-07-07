import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import styles from '../styles/login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className={styles['login-container']}>
      <div className={styles['login-card']}>
        <h1 className={styles['login-title']}>視聴ロックマン</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles['login-input']}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles['login-input']}
          />
          {error && <p className={styles['error-message']}>{error}</p>}
          <button type="submit" disabled={loading} className={styles['login-button']}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        <p className={styles['link-text']}>
          アカウントをお持ちでない方は → <a href="/register">新規登録</a>
        </p>
      </div>
    </div>
  );
}
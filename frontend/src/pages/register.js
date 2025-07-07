import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import styles from '../styles/register.module.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { register, error, setError } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(email, password, passwordConfirm);
  };

  return (
    <div className={styles['register-container']}>
      <div className={styles['register-card']}>
        <h1 className={styles['register-title']}>新規ユーザー登録</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles['register-input']}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles['register-input']}
          />
          <input
            type="password"
            placeholder="Password（確認）"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            className={styles['register-input']}
          />
          {error && <p className={styles['error-message']}>{error}</p>}
          <button type="submit" className={styles['register-button']}>登録</button>
        </form>
        <p className={styles['link-text']}>
          既にアカウントをお持ちの方は → <a href="/login">ログイン</a>
        </p>
      </div>
    </div>
  );
}
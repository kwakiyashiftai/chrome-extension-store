import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // パスワードチェック（デフォルト: "admin123"）
    const adminPassword = localStorage.getItem('admin_password') || 'admin123'

    if (password === adminPassword) {
      localStorage.setItem('is_admin', 'true')
      navigate('/admin/dashboard')
    } else {
      setError('パスワードが間違っています')
      setPassword('')
    }
  }

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">
            <Lock size={48} />
          </div>
          <h1>管理者ログイン</h1>
          <p className="login-subtitle">管理者権限でログインしてください</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">パスワード</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
                autoFocus
              />
            </div>

            <button type="submit" className="login-btn">
              ログイン
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={() => navigate('/')}
            >
              ホームに戻る
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

import { Link } from 'react-router-dom'
import { Search, Upload } from 'lucide-react'
import './Header.css'

function Header({ searchQuery = '', setSearchQuery = () => {}, showSearch = true }) {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">🧩</div>
          <span className="logo-text">Extension Store</span>
        </Link>

        {showSearch && (
          <div className="header-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="拡張機能を検索..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <Link to="/upload" className="upload-btn">
          <Upload size={18} />
          <span>拡張機能を投稿</span>
        </Link>
      </div>
    </header>
  )
}

export default Header

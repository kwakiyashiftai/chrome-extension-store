import { Link } from 'react-router-dom'
import { Search, Upload } from 'lucide-react'
import shiftaiLogo from '../assets/shiftai-logo.png'
import './Header.css'

function Header({ searchQuery = '', setSearchQuery = () => {}, showSearch = true }) {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img
            src={shiftaiLogo}
            alt="SHIFTAI Logo"
            className="logo-image"
          />
          <span className="logo-text">ShareHub</span>
        </Link>

        {showSearch && (
          <div className="header-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="制作物を検索..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <Link to="/upload" className="upload-btn">
          <Upload size={18} />
          <span>制作物を投稿</span>
        </Link>
      </div>
    </header>
  )
}

export default Header

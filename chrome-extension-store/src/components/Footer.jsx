import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>&copy; 2024 ShareHub. All rights reserved.</p>
        </div>
        <Link to="/admin/login" className="admin-link">
          <Shield size={16} />
          <span>管理者</span>
        </Link>
      </div>
    </footer>
  )
}

export default Footer

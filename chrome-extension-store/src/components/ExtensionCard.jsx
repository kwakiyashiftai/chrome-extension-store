import { Link } from 'react-router-dom'
import { Star, Download } from 'lucide-react'
import './ExtensionCard.css'

function ExtensionCard({ extension }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={14}
        className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'}
        fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ))
  }

  return (
    <Link to={`/extension/${extension.id}`} className="extension-card">
      <div className="card-icon">
        <img src={extension.icon} alt={extension.name} />
      </div>

      <div className="card-content">
        <h3 className="card-title">{extension.name}</h3>
        <p className="card-description">{extension.description}</p>

        <div className="card-meta">
          <div className="rating">
            <div className="stars">{renderStars(extension.rating)}</div>
            <span className="rating-text">({extension.reviewCount})</span>
          </div>

          <div className="downloads">
            <Download size={14} />
            <span>{extension.downloads.toLocaleString()}</span>
          </div>
        </div>

        <div className="card-footer">
          <span className="category">{extension.category}</span>
          <span className="featured-badge">{extension.featured && '✨ おすすめ'}</span>
        </div>
      </div>
    </Link>
  )
}

export default ExtensionCard

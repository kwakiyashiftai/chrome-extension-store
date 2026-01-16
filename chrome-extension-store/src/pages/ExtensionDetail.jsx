import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Download, ArrowLeft } from 'lucide-react'
import { getExtensionById, getReviewsByExtensionId, incrementDownloads, addReview } from '../data/store'
import ReviewCard from '../components/ReviewCard'
import './ExtensionDetail.css'

function ExtensionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [extension, setExtension] = useState(null)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    author: ''
  })

  useEffect(() => {
    loadExtension()
    loadReviews()
  }, [id])

  const loadExtension = () => {
    const ext = getExtensionById(id)
    if (ext) {
      setExtension(ext)
    }
  }

  const loadReviews = () => {
    const revs = getReviewsByExtensionId(id)
    setReviews(revs)
  }

  const handleDownload = () => {
    const updated = incrementDownloads(id)
    if (updated) {
      setExtension(updated)
      window.open(extension.downloadUrl, '_blank')
    }
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!newReview.author.trim() || !newReview.comment.trim()) {
      alert('名前とコメントを入力してください')
      return
    }

    addReview({
      extensionId: id,
      ...newReview
    })

    setNewReview({
      rating: 5,
      comment: '',
      author: ''
    })

    loadReviews()
    loadExtension()
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={20}
        className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'}
        fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ))
  }

  if (!extension) {
    return (
      <div className="extension-detail">
        <div className="container">
          <p>拡張機能が見つかりません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="extension-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>

        <div className="detail-header">
          <div className="detail-icon">
            <img src={extension.icon} alt={extension.name} />
          </div>

          <div className="detail-info">
            <h1>{extension.name}</h1>
            <p className="detail-description">{extension.description}</p>

            <div className="detail-meta">
              <div className="rating-display">
                <div className="stars">{renderStars(extension.rating)}</div>
                <span className="rating-text">
                  {extension.rating.toFixed(1)} ({extension.reviewCount}件のレビュー)
                </span>
              </div>

              <div className="download-count">
                <Download size={16} />
                <span>{extension.downloads.toLocaleString()}ダウンロード</span>
              </div>

              <span className="category-badge">{extension.category}</span>
            </div>

            <button className="download-btn" onClick={handleDownload}>
              <Download size={20} />
              <span>ダウンロード</span>
            </button>
          </div>
        </div>

        <div className="detail-content">
          <section className="about-section">
            <h2>詳細</h2>
            <p>{extension.longDescription}</p>
          </section>

          {extension.screenshots && extension.screenshots.length > 0 && (
            <section className="screenshots-section">
              <h2>スクリーンショット</h2>
              <div className="screenshots-grid">
                {extension.screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="screenshot"
                  />
                ))}
              </div>
            </section>
          )}

          <section className="reviews-section">
            <h2>レビュー ({reviews.length})</h2>

            <form className="review-form" onSubmit={handleSubmitReview}>
              <h3>レビューを投稿</h3>

              <div className="form-group">
                <label>評価</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={24}
                      className={star <= newReview.rating ? 'star-filled interactive' : 'star-empty interactive'}
                      fill={star <= newReview.rating ? 'currentColor' : 'none'}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="author">名前</label>
                <input
                  type="text"
                  id="author"
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                  placeholder="あなたの名前"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="comment">コメント</label>
                <textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="この拡張機能についての感想を書いてください"
                  rows="4"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                レビューを投稿
              </button>
            </form>

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">まだレビューがありません。最初のレビューを投稿しましょう！</p>
              ) : (
                reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ExtensionDetail

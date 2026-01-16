import { Star } from 'lucide-react'
import './ReviewCard.css'

function ReviewCard({ review }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'star-filled' : 'star-empty'}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ))
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-author">{review.author}</div>
        <div className="review-date">{formatDate(review.createdAt)}</div>
      </div>

      <div className="review-rating">
        {renderStars(review.rating)}
      </div>

      <p className="review-comment">{review.comment}</p>
    </div>
  )
}

export default ReviewCard

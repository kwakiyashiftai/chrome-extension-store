import { mockExtensions, mockReviews } from './mockData'

const STORAGE_KEYS = {
  EXTENSIONS: 'chrome_store_extensions',
  REVIEWS: 'chrome_store_reviews'
}

// LocalStorageの初期化
export const initializeStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.EXTENSIONS)) {
    localStorage.setItem(STORAGE_KEYS.EXTENSIONS, JSON.stringify(mockExtensions))
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(mockReviews))
  }
}

// 拡張機能の取得
export const getAllExtensions = () => {
  const data = localStorage.getItem(STORAGE_KEYS.EXTENSIONS)
  return data ? JSON.parse(data) : []
}

export const getExtensionById = (id) => {
  const extensions = getAllExtensions()
  return extensions.find(ext => ext.id === id)
}

// 拡張機能の追加
export const addExtension = (extension) => {
  const extensions = getAllExtensions()
  const newExtension = {
    ...extension,
    id: Date.now().toString(),
    downloads: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: Date.now()
  }
  extensions.push(newExtension)
  localStorage.setItem(STORAGE_KEYS.EXTENSIONS, JSON.stringify(extensions))
  return newExtension
}

// ダウンロード数の増加
export const incrementDownloads = (id) => {
  const extensions = getAllExtensions()
  const extension = extensions.find(ext => ext.id === id)
  if (extension) {
    extension.downloads += 1
    localStorage.setItem(STORAGE_KEYS.EXTENSIONS, JSON.stringify(extensions))
    return extension
  }
  return null
}

// 評価の更新
const updateExtensionRating = (extensionId) => {
  const reviews = getReviewsByExtensionId(extensionId)
  if (reviews.length === 0) return

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  const extensions = getAllExtensions()
  const extension = extensions.find(ext => ext.id === extensionId)
  if (extension) {
    extension.rating = Math.round(averageRating * 10) / 10
    extension.reviewCount = reviews.length
    localStorage.setItem(STORAGE_KEYS.EXTENSIONS, JSON.stringify(extensions))
  }
}

// レビューの取得
export const getAllReviews = () => {
  const data = localStorage.getItem(STORAGE_KEYS.REVIEWS)
  return data ? JSON.parse(data) : []
}

export const getReviewsByExtensionId = (extensionId) => {
  const reviews = getAllReviews()
  return reviews.filter(review => review.extensionId === extensionId)
}

// レビューの追加
export const addReview = (review) => {
  const reviews = getAllReviews()
  const newReview = {
    ...review,
    id: Date.now().toString(),
    createdAt: Date.now()
  }
  reviews.push(newReview)
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews))

  // 拡張機能の評価を更新
  updateExtensionRating(review.extensionId)

  return newReview
}

// 検索とフィルタリング
export const searchExtensions = (query, category = 'すべて', sortBy = 'downloads') => {
  let extensions = getAllExtensions()

  // カテゴリフィルター
  if (category && category !== 'すべて') {
    extensions = extensions.filter(ext => ext.category === category)
  }

  // 検索クエリフィルター
  if (query) {
    const lowerQuery = query.toLowerCase()
    extensions = extensions.filter(ext =>
      ext.name.toLowerCase().includes(lowerQuery) ||
      ext.description.toLowerCase().includes(lowerQuery) ||
      ext.longDescription.toLowerCase().includes(lowerQuery)
    )
  }

  // ソート
  switch (sortBy) {
    case 'downloads':
      extensions.sort((a, b) => b.downloads - a.downloads)
      break
    case 'rating':
      extensions.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      extensions.sort((a, b) => b.createdAt - a.createdAt)
      break
    default:
      break
  }

  return extensions
}

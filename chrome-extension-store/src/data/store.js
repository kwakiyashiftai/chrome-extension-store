import { mockExtensions, mockReviews } from './mockData'

const STORAGE_KEYS = {
  EXTENSIONS: 'chrome_store_extensions',
  REVIEWS: 'chrome_store_reviews',
  TABS: 'chrome_store_tabs'
}

// LocalStorageの初期化
export const initializeStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.EXTENSIONS)) {
    // tabIdを追加してから保存
    const extensionsWithTabId = mockExtensions.map(ext => ({
      ...ext,
      tabId: ext.tabId || '1'
    }))
    localStorage.setItem(STORAGE_KEYS.EXTENSIONS, JSON.stringify(extensionsWithTabId))
  } else {
    // 既存の拡張機能にtabIdがない場合は追加
    const extensions = getAllExtensions()
    let updated = false
    const updatedExtensions = extensions.map(ext => {
      if (!ext.tabId) {
        updated = true
        return { ...ext, tabId: '1' }
      }
      return ext
    })
    if (updated) {
      localStorage.setItem(STORAGE_KEYS.EXTENSIONS, JSON.stringify(updatedExtensions))
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(mockReviews))
  }
  if (!localStorage.getItem(STORAGE_KEYS.TABS)) {
    const defaultTabs = [
      { id: '1', name: 'Chrome拡張機能', order: 0 }
    ]
    localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(defaultTabs))
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
    createdAt: Date.now(),
    tabId: extension.tabId || '1' // デフォルトは最初のタブ
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

// 拡張機能の削除
export const deleteExtension = (id) => {
  const extensions = getAllExtensions()
  const filteredExtensions = extensions.filter(ext => ext.id !== id)
  localStorage.setItem(STORAGE_KEYS.EXTENSIONS, JSON.stringify(filteredExtensions))

  // 関連するレビューも削除
  const reviews = getAllReviews()
  const filteredReviews = reviews.filter(review => review.extensionId !== id)
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(filteredReviews))

  return true
}

// レビューの削除
export const deleteReview = (reviewId, extensionId) => {
  const reviews = getAllReviews()
  const filteredReviews = reviews.filter(review => review.id !== reviewId)
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(filteredReviews))

  // 拡張機能の評価を更新
  updateExtensionRating(extensionId)

  return true
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

// タブの取得
export const getAllTabs = () => {
  const data = localStorage.getItem(STORAGE_KEYS.TABS)
  const tabs = data ? JSON.parse(data) : []
  return tabs.sort((a, b) => a.order - b.order)
}

// タブの追加
export const addTab = (name) => {
  const tabs = getAllTabs()
  const newTab = {
    id: Date.now().toString(),
    name,
    order: tabs.length
  }
  tabs.push(newTab)
  localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs))
  return newTab
}

// タブの削除
export const deleteTab = (id) => {
  const tabs = getAllTabs()
  const filteredTabs = tabs.filter(tab => tab.id !== id)
  // orderを再調整
  filteredTabs.forEach((tab, index) => {
    tab.order = index
  })
  localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(filteredTabs))
  return true
}

// タブの更新
export const updateTab = (id, name) => {
  const tabs = getAllTabs()
  const tab = tabs.find(t => t.id === id)
  if (tab) {
    tab.name = name
    localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs))
    return tab
  }
  return null
}

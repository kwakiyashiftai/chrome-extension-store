import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { addExtension } from '../data/store'
import { categories } from '../data/mockData'
import './UploadExtension.css'

function UploadExtension() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    category: 'その他',
    downloadUrl: '',
    featured: false,
    icon: '',
    screenshots: [],
    zipFile: null,
    zipFileName: ''
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'icon') {
        setFormData({ ...formData, icon: reader.result })
      } else if (type === 'screenshot') {
        if (formData.screenshots.length >= 5) {
          alert('スクリーンショットは最大5枚までです')
          return
        }
        setFormData({
          ...formData,
          screenshots: [...formData.screenshots, reader.result]
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const removeScreenshot = (index) => {
    const newScreenshots = formData.screenshots.filter((_, i) => i !== index)
    setFormData({ ...formData, screenshots: newScreenshots })
  }

  const handleZipUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.zip')) {
      alert('ZIPファイルのみアップロード可能です')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('ファイルサイズは50MB以下にしてください')
      return
    }

    setFormData({
      ...formData,
      zipFile: file,
      zipFileName: file.name
    })
  }

  const removeZipFile = () => {
    setFormData({
      ...formData,
      zipFile: null,
      zipFileName: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.description.trim() || !formData.longDescription.trim()) {
      alert('必須項目を入力してください')
      return
    }

    if (!formData.icon) {
      alert('アイコン画像をアップロードしてください')
      return
    }

    if (!formData.downloadUrl.trim() && !formData.zipFile) {
      alert('ダウンロードURLまたはZIPファイルのいずれかを入力してください')
      return
    }

    const newExtension = addExtension(formData)
    alert('拡張機能を投稿しました！')
    navigate(`/extension/${newExtension.id}`)
  }

  return (
    <div className="upload-extension">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>

        <div className="upload-header">
          <h1>拡張機能を投稿</h1>
          <p>あなたの拡張機能を共有しましょう✨</p>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>基本情報</h2>

            <div className="form-group">
              <label htmlFor="name">拡張機能名 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="例: Dark Reader"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">短い説明 *</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="例: すべてのウェブサイトにダークモードを適用"
                maxLength="100"
                required
              />
              <span className="char-count">{formData.description.length}/100</span>
            </div>

            <div className="form-group">
              <label htmlFor="longDescription">詳細説明 *</label>
              <textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                placeholder="拡張機能の機能や特徴を詳しく説明してください"
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">カテゴリ *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.filter(c => c !== 'すべて').map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="downloadUrl">ダウンロードURL</label>
              <input
                type="url"
                id="downloadUrl"
                name="downloadUrl"
                value={formData.downloadUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/extension.crx"
              />
              <span className="field-note">※ ZIPファイルをアップロードする場合は省略可</span>
            </div>

            <div className="form-group">
              <label>拡張機能ZIPファイル</label>
              <div className="zip-upload-area">
                {formData.zipFile ? (
                  <div className="zip-file-preview">
                    <div className="zip-file-info">
                      <div className="zip-icon">📦</div>
                      <div className="zip-details">
                        <span className="zip-name">{formData.zipFileName}</span>
                        <span className="zip-size">
                          {(formData.zipFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="remove-zip-btn"
                      onClick={removeZipFile}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="zip-upload-label">
                    <Upload size={32} />
                    <span className="upload-text">ZIPファイルをアップロード</span>
                    <span className="upload-hint">または、ここにファイルをドロップ</span>
                    <span className="upload-limit">最大50MB</span>
                    <input
                      type="file"
                      accept=".zip"
                      onChange={handleZipUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                <span>おすすめの拡張機能として表示</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h2>画像</h2>

            <div className="form-group">
              <label>アイコン画像 * (推奨: 128x128px)</label>
              <div className="image-upload-area">
                {formData.icon ? (
                  <div className="image-preview">
                    <img src={formData.icon} alt="Icon preview" />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => setFormData({ ...formData, icon: '' })}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="upload-label">
                    <Upload size={32} />
                    <span>クリックしてアップロード</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'icon')}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>スクリーンショット (最大5枚)</label>
              <div className="screenshots-upload">
                {formData.screenshots.map((screenshot, index) => (
                  <div key={index} className="screenshot-preview">
                    <img src={screenshot} alt={`Screenshot ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeScreenshot(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {formData.screenshots.length < 5 && (
                  <label className="screenshot-upload-label">
                    <Upload size={24} />
                    <span>追加</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'screenshot')}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
              キャンセル
            </button>
            <button type="submit" className="submit-btn">
              投稿する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadExtension

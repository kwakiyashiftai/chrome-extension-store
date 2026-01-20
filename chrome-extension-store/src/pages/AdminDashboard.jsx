import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Edit, Trash2, Save, Upload, Settings, Plus, X } from 'lucide-react'
import { getAllExtensions, deleteExtension, getAllTabs, addTab, deleteTab, updateTab, getHomeSettings, updateHomeSettings, getAllCategories, addCategory, deleteCategory, updateCategory } from '../data/store'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const [extensions, setExtensions] = useState([])
  const [tabs, setTabs] = useState([])
  const [newTabName, setNewTabName] = useState('')
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [homeSettings, setHomeSettings] = useState({
    title: 'ShareHub',
    subtitle: 'あなたにぴったりの制作物を見つけよう',
    bannerImage: ''
  })
  const [isEditingHome, setIsEditingHome] = useState(false)

  useEffect(() => {
    // 管理者権限チェック
    const isAdmin = localStorage.getItem('is_admin')
    if (!isAdmin) {
      navigate('/admin/login')
      return
    }

    loadExtensions()
    loadHomeSettings()
    loadTabs()
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadExtensions = async () => {
    const exts = await getAllExtensions()
    setExtensions(exts)
  }

  const loadTabs = async () => {
    const allTabs = await getAllTabs()
    setTabs(allTabs)
  }

  const loadCategories = async () => {
    const allCategories = await getAllCategories()
    setCategories(allCategories)
  }

  const loadHomeSettings = async () => {
    const settings = await getHomeSettings()
    if (settings) {
      setHomeSettings({
        title: settings.title,
        subtitle: settings.subtitle,
        bannerImage: settings.banner_image
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('is_admin')
    navigate('/')
  }

  const handleDeleteExtension = async (id, name) => {
    if (window.confirm(`「${name}」を削除してもよろしいですか？`)) {
      await deleteExtension(id)
      await loadExtensions()
    }
  }

  const handleSaveHomeSettings = async () => {
    try {
      await updateHomeSettings(homeSettings)
      setIsEditingHome(false)
      alert('ホーム設定を保存しました')
    } catch (error) {
      alert('保存に失敗しました')
      console.error(error)
    }
  }

  const handleBannerImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setHomeSettings({ ...homeSettings, bannerImage: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveBannerImage = () => {
    setHomeSettings({ ...homeSettings, bannerImage: '' })
  }

  const handleAddTab = async () => {
    if (!newTabName.trim()) {
      alert('タブ名を入力してください')
      return
    }
    await addTab(newTabName)
    setNewTabName('')
    await loadTabs()
  }

  const handleDeleteTab = async (id, name) => {
    if (tabs.length <= 1) {
      alert('最低1つのタブが必要です')
      return
    }
    if (window.confirm(`「${name}」タブを削除してもよろしいですか？`)) {
      await deleteTab(id)
      await loadTabs()
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('カテゴリ名を入力してください')
      return
    }
    try {
      await addCategory(newCategoryName)
      setNewCategoryName('')
      await loadCategories()
    } catch (error) {
      if (error.message?.includes('duplicate') || error.code === '23505') {
        alert('このカテゴリ名は既に存在します')
      } else {
        alert('カテゴリの追加に失敗しました')
      }
    }
  }

  const handleDeleteCategory = async (id, name) => {
    if (window.confirm(`「${name}」カテゴリを削除してもよろしいですか？\n注意: このカテゴリを使用している制作物がある場合は、先に変更してください。`)) {
      const success = await deleteCategory(id)
      if (success) {
        await loadCategories()
      } else {
        alert('カテゴリの削除に失敗しました')
      }
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <Settings size={28} />
            <h1>管理者ダッシュボード</h1>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>ログアウト</span>
          </button>
        </div>
      </div>

      <div className="admin-container">
        {/* ホーム画面設定 */}
        <div className="admin-section">
          <div className="section-header">
            <h2>ホーム画面設定</h2>
            {!isEditingHome ? (
              <button
                className="edit-btn"
                onClick={() => setIsEditingHome(true)}
              >
                <Edit size={16} />
                <span>編集</span>
              </button>
            ) : (
              <button
                className="save-btn"
                onClick={handleSaveHomeSettings}
              >
                <Save size={16} />
                <span>保存</span>
              </button>
            )}
          </div>

          {isEditingHome ? (
            <div className="home-settings-form">
              <div className="form-group">
                <label>タイトル</label>
                <input
                  type="text"
                  value={homeSettings.title}
                  onChange={(e) =>
                    setHomeSettings({ ...homeSettings, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>サブタイトル</label>
                <input
                  type="text"
                  value={homeSettings.subtitle}
                  onChange={(e) =>
                    setHomeSettings({ ...homeSettings, subtitle: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>バナー画像</label>
                <div className="banner-upload">
                  {homeSettings.bannerImage && (
                    <div className="banner-preview">
                      <img src={homeSettings.bannerImage} alt="Banner" />
                      <button
                        type="button"
                        className="remove-banner-btn"
                        onClick={handleRemoveBannerImage}
                      >
                        <X size={16} />
                        <span>削除</span>
                      </button>
                    </div>
                  )}
                  <label className="upload-label">
                    <Upload size={20} />
                    <span>画像をアップロード</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="home-settings-display">
              <div className="setting-item">
                <span className="setting-label">タイトル:</span>
                <span className="setting-value">{homeSettings.title}</span>
              </div>
              <div className="setting-item">
                <span className="setting-label">サブタイトル:</span>
                <span className="setting-value">{homeSettings.subtitle}</span>
              </div>
              {homeSettings.bannerImage && (
                <div className="setting-item">
                  <span className="setting-label">バナー画像:</span>
                  <div className="banner-preview-small">
                    <img src={homeSettings.bannerImage} alt="Banner" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* タブ管理 */}
        <div className="admin-section">
          <div className="section-header">
            <h2>タブ管理</h2>
          </div>

          <div className="tab-add-form">
            <input
              type="text"
              placeholder="新しいタブ名を入力"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTab()}
            />
            <button className="add-tab-btn" onClick={handleAddTab}>
              <Plus size={16} />
              <span>タブを追加</span>
            </button>
          </div>

          <div className="tabs-list">
            {tabs.map(tab => (
              <div key={tab.id} className="tab-item">
                <span className="tab-name">{tab.name}</span>
                <button
                  className="delete-tab-btn"
                  onClick={() => handleDeleteTab(tab.id, tab.name)}
                  disabled={tabs.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* カテゴリ管理 */}
        <div className="admin-section">
          <div className="section-header">
            <h2>カテゴリ管理</h2>
          </div>

          <div className="tab-add-form">
            <input
              type="text"
              placeholder="新しいカテゴリ名を入力"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button className="add-tab-btn" onClick={handleAddCategory}>
              <Plus size={16} />
              <span>カテゴリを追加</span>
            </button>
          </div>

          <div className="tabs-list">
            {categories.map(category => (
              <div key={category.id} className="tab-item">
                <span className="tab-name">{category.name}</span>
                <button
                  className="delete-tab-btn"
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 制作物一覧 */}
        <div className="admin-section">
          <div className="section-header">
            <h2>制作物一覧 ({extensions.length}件)</h2>
          </div>

          <div className="extensions-list">
            {extensions.length === 0 ? (
              <p className="empty-message">制作物がありません</p>
            ) : (
              extensions.map((ext) => (
                <div key={ext.id} className="extension-item">
                  <img src={ext.icon} alt={ext.name} className="extension-icon" />
                  <div className="extension-info">
                    <h3>{ext.name}</h3>
                    <p>{ext.description}</p>
                    <div className="extension-meta">
                      <span>カテゴリ: {ext.category}</span>
                      <span>ダウンロード: {ext.downloads}回</span>
                      <span>評価: {ext.rating}⭐</span>
                    </div>
                  </div>
                  <div className="extension-actions">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/extension/${ext.id}`)}
                    >
                      詳細を見る
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteExtension(ext.id, ext.name)}
                    >
                      <Trash2 size={16} />
                      <span>削除</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

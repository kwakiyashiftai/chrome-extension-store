import { useState, useEffect } from 'react'
import { initializeStore, searchExtensions, getAllTabs, getHomeSettings } from '../data/store'
import ExtensionCard from '../components/ExtensionCard'
import FilterBar from '../components/FilterBar'
import './Home.css'

function Home({ searchQuery = '' }) {
  const [extensions, setExtensions] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [sortBy, setSortBy] = useState('downloads')
  const [tabs, setTabs] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [homeSettings, setHomeSettings] = useState({
    title: 'SHIFTAI会員限定ストア',
    subtitle: 'あなたのブラウジング体験をパワーアップ✨',
    bannerImage: ''
  })

  useEffect(() => {
    const init = async () => {
      await initializeStore()
      await loadTabs()
      await loadHomeSettings()
    }
    init()
  }, [])

  useEffect(() => {
    loadExtensions()
  }, [searchQuery, selectedCategory, sortBy, activeTab])

  const loadTabs = async () => {
    const allTabs = await getAllTabs()
    setTabs(allTabs)
    if (allTabs.length > 0 && !activeTab) {
      setActiveTab(allTabs[0].id)
    }
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

  const loadExtensions = async () => {
    let results = await searchExtensions(searchQuery, selectedCategory, sortBy)
    // アクティブなタブでフィルタリング
    results = results.filter(ext => ext.tabId === activeTab || !ext.tabId)
    setExtensions(results)
  }

  const featuredExtensions = extensions.filter(ext => ext.featured)
  const regularExtensions = extensions.filter(ext => !ext.featured)

  return (
    <div className="home">
      <div className="container">
        {homeSettings.bannerImage && (
          <div className="home-banner">
            <img src={homeSettings.bannerImage} alt="Banner" />
          </div>
        )}

        <header className="page-header">
          <h1>{homeSettings.title}</h1>
          <p>{homeSettings.subtitle}</p>
        </header>

        {tabs.length > 0 && (
          <div className="tabs-container">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}

        <FilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {featuredExtensions.length > 0 && (
          <section className="featured-section">
            <h2 className="section-title">✨ おすすめの制作物</h2>
            <div className="extensions-grid">
              {featuredExtensions.map(extension => (
                <ExtensionCard key={extension.id} extension={extension} />
              ))}
            </div>
          </section>
        )}

        {regularExtensions.length > 0 && (
          <section className="extensions-section">
            <h2 className="section-title">すべての制作物</h2>
            <div className="extensions-grid">
              {regularExtensions.map(extension => (
                <ExtensionCard key={extension.id} extension={extension} />
              ))}
            </div>
          </section>
        )}

        {extensions.length === 0 && (
          <div className="no-results">
            <p>制作物が見つかりませんでした</p>
            <p>別のキーワードやカテゴリで試してみてください</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

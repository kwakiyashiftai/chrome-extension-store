import { useState, useEffect } from 'react'
import { initializeStore, searchExtensions } from '../data/store'
import ExtensionCard from '../components/ExtensionCard'
import FilterBar from '../components/FilterBar'
import './Home.css'

function Home({ searchQuery = '' }) {
  const [extensions, setExtensions] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [sortBy, setSortBy] = useState('downloads')

  useEffect(() => {
    initializeStore()
    loadExtensions()
  }, [searchQuery, selectedCategory, sortBy])

  const loadExtensions = () => {
    const results = searchExtensions(searchQuery, selectedCategory, sortBy)
    setExtensions(results)
  }

  const featuredExtensions = extensions.filter(ext => ext.featured)
  const regularExtensions = extensions.filter(ext => !ext.featured)

  return (
    <div className="home">
      <div className="container">
        <header className="page-header">
          <h1>拡張機能ストア</h1>
          <p>あなたのブラウジング体験をパワーアップ✨</p>
        </header>

        <FilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {featuredExtensions.length > 0 && (
          <section className="featured-section">
            <h2 className="section-title">✨ おすすめの拡張機能</h2>
            <div className="extensions-grid">
              {featuredExtensions.map(extension => (
                <ExtensionCard key={extension.id} extension={extension} />
              ))}
            </div>
          </section>
        )}

        {regularExtensions.length > 0 && (
          <section className="extensions-section">
            <h2 className="section-title">すべての拡張機能</h2>
            <div className="extensions-grid">
              {regularExtensions.map(extension => (
                <ExtensionCard key={extension.id} extension={extension} />
              ))}
            </div>
          </section>
        )}

        {extensions.length === 0 && (
          <div className="no-results">
            <p>拡張機能が見つかりませんでした</p>
            <p>別のキーワードやカテゴリで試してみてください</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

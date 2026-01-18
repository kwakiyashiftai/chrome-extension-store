import { useState, useEffect } from 'react'
import { getAllCategories } from '../data/store'
import './FilterBar.css'

function FilterBar({ selectedCategory, onCategoryChange, sortBy, onSortChange }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const data = await getAllCategories()
    // 「すべて」を先頭に追加
    setCategories(['すべて', ...data.map(cat => cat.name)])
  }

  return (
    <div className="filter-bar">
      <div className="categories">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="sort-options">
        <label htmlFor="sort">並び替え:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="downloads">人気順</option>
          <option value="rating">評価順</option>
          <option value="newest">新着順</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar

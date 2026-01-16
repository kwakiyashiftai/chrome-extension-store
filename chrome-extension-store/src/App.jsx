import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ExtensionDetail from './pages/ExtensionDetail'
import UploadExtension from './pages/UploadExtension'
import './App.css'

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  return (
    <div className="App">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearch={location.pathname === '/'}
      />
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/extension/:id" element={<ExtensionDetail />} />
        <Route path="/upload" element={<UploadExtension />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

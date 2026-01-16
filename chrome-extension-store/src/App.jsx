import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ExtensionDetail from './pages/ExtensionDetail'
import UploadExtension from './pages/UploadExtension'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  // 管理者ページではヘッダーを非表示
  const hideHeader = location.pathname.startsWith('/admin')

  return (
    <div className="App">
      {!hideHeader && (
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSearch={location.pathname === '/'}
        />
      )}
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/extension/:id" element={<ExtensionDetail />} />
        <Route path="/upload" element={<UploadExtension />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      {!hideHeader && <Footer />}
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

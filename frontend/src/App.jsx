import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import VehicleShowcase from './components/VehicleShowcase'
import ProductShowcase from './components/ProductShowcase'
import Newsletter from './components/Newsletter'
import ChatModal from './components/ChatModal'
import AuthModal from './components/AuthModal'
import AttackPanel from './components/AttackPanel'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'
  const [isAttackPanelOpen, setIsAttackPanelOpen] = useState(false)
  const [user, setUser] = useState(null)

  const openAuth = (mode) => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        user={user}
        onChatOpen={() => setIsChatOpen(true)}
        onAuthOpen={openAuth}
        onLogout={handleLogout}
      />
      
      <main>
        <Hero onChatOpen={() => setIsChatOpen(true)} />
        <VehicleShowcase />
        <ProductShowcase user={user} />
        <Newsletter />
      </main>

      {/* Modals */}
      <ChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        user={user}
      />
      
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onLogin={handleLogin}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />

      {/* Attack Panel for Security Research */}
      <AttackPanel 
        isOpen={isAttackPanelOpen}
        onToggle={() => setIsAttackPanelOpen(!isAttackPanelOpen)}
      />
    </div>
  )
}

export default App

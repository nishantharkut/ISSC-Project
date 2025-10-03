import { TruckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function Navbar({ user, onChatOpen, onAuthOpen, onLogout }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <TruckIcon className="h-8 w-8 text-accent-600" />
            <span className="text-2xl font-bold text-primary-900">AutoElite</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-600 hover:text-accent-600 font-medium transition-colors">
              Home
            </a>
            <a href="#vehicles" className="text-gray-600 hover:text-accent-600 font-medium transition-colors">
              Vehicles
            </a>
            <a href="#products" className="text-gray-600 hover:text-accent-600 font-medium transition-colors">
              Products
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onChatOpen}
              className="flex items-center space-x-2 bg-accent-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent-700 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span>AI Assistant</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <button
                  onClick={onLogout}
                  className="btn-secondary text-sm px-3 py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onAuthOpen('login')}
                  className="btn-secondary text-sm px-3 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => onAuthOpen('register')}
                  className="btn-primary text-sm px-3 py-2"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
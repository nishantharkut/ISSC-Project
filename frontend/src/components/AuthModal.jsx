import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function AuthModal({ isOpen, onClose, mode, onLogin, onSwitchMode }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register'
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Authentication failed')
      }

      const data = await response.json()
      
      if (data.message === 'Login successful' || data.message === 'Registration successful') {
        onLogin({
          id: data.user_id || data.user?.id || Math.floor(Math.random() * 1000),
          name: data.user?.name || formData.name || formData.username,
          email: data.user?.email || formData.email,
          username: data.user?.username || formData.username
        })
        setFormData({ name: '', username: '', email: '', password: '' })
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-accent-800 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {mode === 'login' ? 'Login' : 'Register'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-accent-600 focus:outline-none transition-colors"
                />
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-accent-600 focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-accent-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-accent-600 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? (mode === 'login' ? 'Logging in...' : 'Registering...') 
                : (mode === 'login' ? 'Login' : 'Register')
              }
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
              className="text-accent-600 hover:text-accent-700 font-medium"
            >
              {mode === 'login' 
                ? "Don't have an account? Register" 
                : "Already have an account? Login"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
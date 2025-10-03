import { useState, useEffect } from 'react'
import { XMarkIcon, BoltIcon, CalendarIcon, CurrencyDollarIcon, CogIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function CarModal({ isOpen, onClose, carId }) {
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && carId) {
      fetchCarDetails()
    }
  }, [isOpen, carId])

  const fetchCarDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${carId}`)
      const data = await response.json()
      
      if (response.ok) {
        setCar(data.car)
      } else {
        setError(data.error || 'Failed to load car details')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const getCarImage = (make, model) => {
    const carImages = {
      'Tesla': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop&crop=center',
      'Porsche': 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=600&h=400&fit=crop&crop=center',
      'Ferrari': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&crop=center',
      'Lamborghini': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&crop=center',
      'BMW': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop&crop=center',
      'Mercedes-AMG': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&crop=center'
    }
    return carImages[make] || 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&crop=center'
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getCarBadge = (type, price) => {
    if (type === 'Electric') return 'Electric'
    if (price > 200000) return 'Supercar'
    if (price > 100000) return 'Luxury'
    return 'Sports'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary-900">
            {loading ? 'Loading...' : car ? `${car.year} ${car.make} ${car.model}` : 'Car Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <XMarkIcon className="h-12 w-12 mx-auto mb-2" />
                <p className="text-lg font-semibold">Error loading car details</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
              <button
                onClick={fetchCarDetails}
                className="bg-accent-600 text-white px-6 py-2 rounded-lg hover:bg-accent-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {car && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Car Image */}
              <div className="relative">
                <img
                  src={getCarImage(car.make, car.model)}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-primary-900 px-3 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                    {getCarBadge(car.type, car.price)}
                  </span>
                </div>
              </div>

              {/* Car Details */}
              <div className="space-y-6">
                {/* Price */}
                <div className="bg-gradient-to-r from-accent-50 to-accent-100 p-6 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <CurrencyDollarIcon className="h-6 w-6 text-accent-600" />
                    <span className="text-sm font-medium text-accent-800 uppercase tracking-wide">Price</span>
                  </div>
                  <div className="text-3xl font-bold text-accent-900">
                    {formatPrice(car.price)}
                  </div>
                </div>

                {/* Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary-900 border-b border-gray-200 pb-2">
                    Specifications
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Year</p>
                        <p className="font-semibold text-gray-900">{car.year}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <BoltIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Power</p>
                        <p className="font-semibold text-gray-900">{car.hp} HP</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CogIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                        <p className="font-semibold text-gray-900">{car.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Stock</p>
                        <p className="font-semibold text-gray-900">{car.stock} available</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-accent-600 to-accent-500 text-white py-4 rounded-xl font-semibold hover:from-accent-700 hover:to-accent-600 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg">
                    Schedule Test Drive
                  </button>
                  <button className="w-full bg-white border-2 border-accent-600 text-accent-600 py-4 rounded-xl font-semibold hover:bg-accent-50 transition-colors">
                    Request Quote
                  </button>
                </div>

                {/* Stock Status */}
                <div className={`p-4 rounded-lg ${car.stock > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${car.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium ${car.stock > 0 ? 'text-green-800' : 'text-red-800'}`}>
                      {car.stock > 0 ? `${car.stock} units available` : 'Currently out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
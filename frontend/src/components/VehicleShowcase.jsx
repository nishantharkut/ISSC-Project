import { useState, useEffect } from 'react'
import { BoltIcon, ClockIcon, CogIcon } from '@heroicons/react/24/outline'
import CarModal from './CarModal'

export default function VehicleShowcase() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCarId, setSelectedCarId] = useState(null)
  const [isCarModalOpen, setIsCarModalOpen] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cars')
      const data = await response.json()
      
      if (response.ok) {
        setVehicles(data.cars)
      } else {
        console.error('Failed to fetch vehicles:', data.error)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (carId) => {
    setSelectedCarId(carId)
    setIsCarModalOpen(true)
  }

  const closeCarModal = () => {
    setIsCarModalOpen(false)
    setSelectedCarId(null)
  }

  const getCarImage = (make, model) => {
    const carImages = {
      'Tesla': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=240&fit=crop&crop=center',
      'Porsche': 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=240&fit=crop&crop=center',
      'Ferrari': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=240&fit=crop&crop=center',
      'Lamborghini': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=240&fit=crop&crop=center',
      'BMW': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=240&fit=crop&crop=center',
      'Mercedes-AMG': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=240&fit=crop&crop=center'
    }
    return carImages[make] || 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=240&fit=crop&crop=center'
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

  const getAcceleration = (hp) => {
    // Estimate 0-60 times based on HP (this is simplified)
    if (hp > 900) return '2.1s 0-60'
    if (hp > 700) return '2.9s 0-60'
    if (hp > 600) return '3.2s 0-60'
    if (hp > 500) return '3.8s 0-60'
    return '4.0s 0-60'
  }

  if (loading) {
    return (
      <section id="vehicles" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
              Premium Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked luxury vehicles for the ultimate driving experience
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section id="vehicles" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            Premium Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked luxury vehicles for the ultimate driving experience
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Vehicle Image */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={getCarImage(vehicle.make, vehicle.model)}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-primary-900 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {getCarBadge(vehicle.type, vehicle.price)}
                  </span>
                </div>
              </div>

              {/* Vehicle Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-900 mb-4">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>

                {/* Specs */}
                <div className="flex flex-wrap gap-4 mb-5">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <BoltIcon className="h-4 w-4 text-accent-600" />
                    <span>{vehicle.hp} HP</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 text-accent-600" />
                    <span>{getAcceleration(vehicle.hp)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CogIcon className="h-4 w-4 text-accent-600" />
                    <span>{vehicle.type}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-primary-900 mb-5">
                  {formatPrice(vehicle.price)}
                </div>

                {/* Stock Status */}
                <div className={`text-sm mb-4 ${vehicle.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {vehicle.stock > 0 ? `${vehicle.stock} available` : 'Out of stock'}
                </div>

                {/* CTA Button */}
                <button 
                  onClick={() => handleViewDetails(vehicle.id)}
                  className="w-full bg-gradient-to-r from-accent-600 to-accent-500 text-white py-3 rounded-xl font-semibold hover:from-accent-700 hover:to-accent-600 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Car Modal */}
        <CarModal 
          isOpen={isCarModalOpen}
          onClose={closeCarModal}
          carId={selectedCarId}
        />
      </div>
    </section>
  )
}
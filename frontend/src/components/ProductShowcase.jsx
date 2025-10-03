import { useState } from 'react'
import ProductModal from './ProductModal'

const products = [
  {
    id: 'leather-jacket',
    name: 'Lightweight "l33t" Leather Jacket',
    price: '$299.99',
    description: 'Premium lightweight leather jacket with modern styling',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: 'umbrella',
    name: 'Premium Auto Umbrella',
    price: '$49.99',
    description: 'High-quality umbrella with auto-open feature',
    image: 'https://images.unsplash.com/photo-1527002825904-0e4e39c67b21?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: 'keychain',
    name: 'AutoElite Keychain',
    price: '$19.99',
    description: 'Elegant metal keychain with AutoElite logo',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop&crop=center'
  }
]

export default function ProductShowcase({ user }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState({})

  const openProductModal = (product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
    setIsProductModalOpen(false)
  }

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  const getImageSrc = (product) => {
    if (imageErrors[product.id]) {
      // Fallback images
      const fallbackImages = {
        'leather-jacket': 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Leather+Jacket',
        'umbrella': 'https://via.placeholder.com/300x300/4169E1/FFFFFF?text=Umbrella',
        'keychain': 'https://via.placeholder.com/300x300/FFD700/000000?text=Keychain'
      }
      return fallbackImages[product.id] || 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=Product'
    }
    return product.image
  }

  return (
    <>
      <section id="products" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
              AutoElite Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium accessories and lifestyle products for automotive enthusiasts
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center border border-gray-100"
              >
                <div className="h-48 mb-6 overflow-hidden rounded-xl">
                  <img
                    src={getImageSrc(product)}
                    alt={product.name}
                    onError={() => handleImageError(product.id)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <h4 className="text-xl font-bold text-primary-900 mb-4">
                  {product.name}
                </h4>
                
                <p className="text-gray-600 mb-6">
                  {product.price} | {product.description}
                </p>
                
                <button 
                  onClick={() => openProductModal(product)}
                  className="btn-primary w-full"
                >
                  View Details & Reviews
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        product={selectedProduct}
        user={user}
      />
    </>
  )
}
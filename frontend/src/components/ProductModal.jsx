import { useState, useEffect, useCallback } from 'react'
import { XMarkIcon, StarIcon, UserIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

export default function ProductModal({ isOpen, onClose, product, user }) {
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productData, setProductData] = useState(null)

  const fetchProductData = useCallback(async () => {
    if (!product) return
    try {
      const response = await fetch(`http://localhost:5000/api/products`)
      if (response.ok) {
        const data = await response.json()
        const foundProduct = data.products.find(p => p.id === product.id)
        if (foundProduct) {
          setProductData(foundProduct)
          setReviews(foundProduct.reviews || [])
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error)
    }
  }, [product])

  useEffect(() => {
    if (isOpen && product) {
      fetchProductData()
    }
  }, [isOpen, product, fetchProductData])

  const submitReview = async () => {
    if (!newReview.trim() || !user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`http://localhost:5000/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          review: newReview,
          author: user.username || user.name
        })
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(prev => [...prev, data.review])
        setNewReview('')
        // Refresh product data to get updated reviews
        fetchProductData()
      } else {
        alert('Failed to submit review. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Error submitting review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-accent-800 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {product.name}
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Product Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Product Image */}
            <div className="h-80 overflow-hidden rounded-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div>
              <div className="text-3xl font-bold text-primary-900 mb-4">
                {product.price}
              </div>
              <p className="text-gray-600 mb-6">
                {productData?.description || product.description}
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className="bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm font-medium">
                    {productData?.category || 'Product'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 pt-8">
            <h4 className="text-2xl font-bold text-primary-900 mb-6">
              Customer Reviews ({reviews.length})
            </h4>

            {/* Add Review Form */}
            {user ? (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h5 className="font-semibold text-gray-900 mb-4">Write a Review</h5>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:border-accent-600 focus:outline-none resize-none"
                  rows={4}
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={submitReview}
                    disabled={!newReview.trim() || isSubmitting}
                    className="bg-gradient-to-r from-accent-600 to-accent-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-accent-700 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <p className="text-yellow-800">
                  Please log in to write a review.
                </p>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={review.id || index} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 rounded-full p-2">
                        <UserIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h6 className="font-semibold text-gray-900">{review.author}</h6>
                          <span className="text-sm text-gray-500">
                            {review.timestamp ? new Date(review.timestamp * 1000).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet. Be the first to review this product!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
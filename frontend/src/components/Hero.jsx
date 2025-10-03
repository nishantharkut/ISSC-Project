import { RocketLaunchIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

export default function Hero({ onChatOpen }) {
  const scrollToVehicles = () => {
    document.getElementById('vehicles')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-accent-800 flex items-center">
      <div className="max-w-6xl mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Experience Automotive
            <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent"> Excellence</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
            Discover our curated collection of premium luxury vehicles crafted for the ultimate driving experience
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={onChatOpen}
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-gold-500 to-gold-400 text-primary-900 px-8 py-4 rounded-full font-bold text-lg hover:from-gold-600 hover:to-gold-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <RocketLaunchIcon className="h-6 w-6" />
              <span>Talk to AI Assistant</span>
            </button>
            
            <button
              onClick={scrollToVehicles}
              className="inline-flex items-center justify-center space-x-3 bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronDownIcon className="h-6 w-6" />
              <span>View Collection</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">50+</div>
              <div className="text-sm uppercase tracking-wider text-white/80">Premium Vehicles</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">15</div>
              <div className="text-sm uppercase tracking-wider text-white/80">Luxury Brands</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">24/7</div>
              <div className="text-sm uppercase tracking-wider text-white/80">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
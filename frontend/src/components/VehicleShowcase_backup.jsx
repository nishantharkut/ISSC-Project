import { BoltIcon, ClockIcon, CogIcon } from '@heroicons/react/24/outline'

const vehicles = [
  {
    id: 1,
    name: "Tesla Model S Plaid",
    price: "$129,990",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=240&fit=crop&crop=center",
    badge: "Electric",
    specs: [
      { icon: BoltIcon, label: "1,020 HP" },
      { icon: ClockIcon, label: "2.1s 0-60" },
      { icon: CogIcon, label: "Electric" }
    ]
  },
  {
    id: 2,
    name: "Porsche 911 Turbo S",
    price: "$207,000",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=240&fit=crop&crop=center",
    badge: "Sports",
    specs: [
      { icon: BoltIcon, label: "640 HP" },
      { icon: ClockIcon, label: "2.6s 0-60" },
      { icon: BeakerIcon, label: "Premium" }
    ]
  },
  {
    id: 3,
    name: "Ferrari F8 Tributo",
    price: "$283,950",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=240&fit=crop&crop=center",
    badge: "Supercar",
    specs: [
      { icon: BoltIcon, label: "710 HP" },
      { icon: ClockIcon, label: "2.9s 0-60" },
      { icon: BeakerIcon, label: "Premium" }
    ]
  },
  {
    id: 4,
    name: "Lamborghini Huracán",
    price: "$248,295",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=240&fit=crop&crop=center",
    badge: "Supercar",
    specs: [
      { icon: BoltIcon, label: "631 HP" },
      { icon: ClockIcon, label: "3.2s 0-60" },
      { icon: BeakerIcon, label: "Premium" }
    ]
  },
  {
    id: 5,
    name: "BMW M4 Competition",
    price: "$78,800",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=240&fit=crop&crop=center",
    badge: "Sports",
    specs: [
      { icon: BoltIcon, label: "503 HP" },
      { icon: ClockIcon, label: "3.8s 0-60" },
      { icon: BeakerIcon, label: "Premium" }
    ]
  },
  {
    id: 6,
    name: "Mercedes-AMG GT",
    price: "$118,600",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=240&fit=crop&crop=center",
    badge: "Luxury",
    specs: [
      { icon: BoltIcon, label: "577 HP" },
      { icon: ClockIcon, label: "3.6s 0-60" },
      { icon: BeakerIcon, label: "Premium" }
    ]
  }
]

export default function VehicleShowcase() {
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
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-primary-900 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {vehicle.badge}
                  </span>
                </div>
              </div>

              {/* Vehicle Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-900 mb-4">
                  {vehicle.name}
                </h3>

                {/* Specs */}
                <div className="flex flex-wrap gap-4 mb-5">
                  {vehicle.specs.map((spec, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <spec.icon className="h-4 w-4 text-accent-600" />
                      <span>{spec.label}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-primary-900 mb-5">
                  {vehicle.price}
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-accent-600 to-accent-500 text-white py-3 rounded-xl font-semibold hover:from-accent-700 hover:to-accent-600 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
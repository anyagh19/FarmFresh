import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6 text-center">About FarmFresh</h1>
        <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-12">
          Bridging the gap between hardworking farmers and conscious consumers.
        </p>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <img
            src="https://images.unsplash.com/photo-1607879940819-fb1f55695c1a"
            alt="Farmers working"
            className="w-full rounded-lg shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-md leading-relaxed">
              At <strong>FarmFresh</strong>, our mission is simple yet powerful — to empower farmers by giving them a digital platform to sell their fresh produce directly to consumers. We believe in transparency, fair prices, and sustainable agriculture.
            </p>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <p className="text-md leading-relaxed">
              We connect local farmers to buyers who value freshness and quality. Our platform helps farmers list their products easily, while customers enjoy farm-to-table shopping with trust and convenience. Whether it's seasonal fruits, vegetables, grains, or dairy — we bring the farm to your doorstep.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1606788075761-1ff7c11d0cf4"
            alt="Fresh produce"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Values Section */}
        <div className="bg-green-50 p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            <div>
              <h3 className="text-xl font-bold mb-2">💚 Fresh & Organic</h3>
              <p className="text-sm">Straight from the farm, without harmful chemicals or preservatives.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">🤝 Fair Trade</h3>
              <p className="text-sm">We ensure farmers get what they truly deserve for their hard work.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">🚚 Hassle-Free Delivery</h3>
              <p className="text-sm">Timely and reliable delivery, so you never miss your farm-fresh goods.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

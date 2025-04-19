import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-green-400 text-white px-6 py-10 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3">FarmFresh</h2>
          <p className="text-sm">
            Empowering farmers. Delivering freshness. Support local. Eat healthy.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="hover:text-yellow-300"><FaFacebookF /></a>
            <a href="#" className="hover:text-yellow-300"><FaInstagram /></a>
            <a href="#" className="hover:text-yellow-300"><FaTwitter /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <Link to='/'><li className="hover:underline">Home</li></Link>
            <Link to='/products'><li className="hover:underline">Shop</li></Link>
            <Link to='/signup-form'><li className="hover:underline">Become a Seller</li></Link>
            <Link to='/about'><li className="hover:underline">About US</li></Link>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2"><FaEnvelope /> support@farmfresh.com</li>
            <li className="flex items-center gap-2"><FaPhoneAlt /> +91 98765 43210</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Subscribe</h3>
          <p className="text-sm mb-3">Get updates on fresh products & offers!</p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded text-black w-full"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-green-700 mt-8 pt-4 text-center text-sm">
        © {new Date().getFullYear()} FarmFresh. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer

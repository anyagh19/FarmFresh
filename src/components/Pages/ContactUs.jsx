import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6 md:p-12">
      <motion.div 
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Contact Us
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div 
            className="space-y-6"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <Mail className="text-green-600" />
              <p className="text-gray-700 text-lg">support@farmfresh.com</p>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-green-600" />
              <p className="text-gray-700 text-lg">+91 98765 43210</p>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-green-600" />
              <p className="text-gray-700 text-lg">Pune, Maharashtra, India</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form 
            className="space-y-4"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-600">Your Name</label>
              <input type="text" placeholder="John Doe" className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input type="email" placeholder="john@example.com" className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Message</label>
              <textarea rows="4" placeholder="Write your message..." className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"></textarea>
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition duration-300">
              Send Message
            </button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;

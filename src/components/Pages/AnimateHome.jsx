import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Truck, DollarSign, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnimateHome = () => {
  const text = 'Buy Directly From Farmers';
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + text.charAt(index));
      index++;
      if (index === text.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/474x/7c/ec/f6/7cecf6923f9ae0e922090c6ceb2c4b06.jpg)'
      }}
    >
      <div className="relative z-10 text-white p-6 md:px-12 lg:px-20 py-16 bg-black/40 ">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {displayedText}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            We Provide All The Products Directly From Farmers Field To The Customers.
          </motion.p>
          <motion.p
            className="text-orange-400 font-semibold text-lg mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Celebrate Your Diwali Festival With Us
          </motion.p>
          <motion.p
            className="text-green-400 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Be Reason For Farmers Happyness..!
          </motion.p>
          <motion.p
            className="text-md md:text-lg mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Order Now & Get One Premium Diwali Lamp With Order Above Rs. 249 Only /-
          </motion.p>
          <Link to="/home">
            <motion.button
              className="mt-6 px-6 py-3 bg-green-500 hover:bg-red-500 rounded-full text-xl font-bold transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              Buy Now !
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-white shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 md:p-6">
        {[
          {
            icon: <Truck className="text-green-500" size={32} />,
            title: 'Get Fresh & Safe',
            desc: 'To Get Fresh, We Deliver only in Morning'
          },
          {
            icon: <DollarSign className="text-green-500" size={32} />,
            title: 'Save Money',
            desc: 'Get Free Delivery Over ₹199'
          },
          {
            icon: <Percent className="text-green-500" size={32} />,
            title: 'Fair & Affordable',
            desc: 'Get Fair & Affordable Price Than Others'
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-3xl hover:scale-105 transition-transform bg-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            {item.icon}
            <div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnimateHome;

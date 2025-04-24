import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Direct from Farmers",
    desc: "Buy fresh and organic produce directly from local farmers. No middlemen, no extra cost.",
    icon: "🌾",
  },
  {
    title: "Empower Local Agriculture",
    desc: "Support your community by empowering farmers to grow and sell more efficiently.",
    icon: "🤝",
  },
  {
    title: "Transparent & Fair Pricing",
    desc: "Fair rates for farmers and affordable prices for consumers.",
    icon: "💰",
  },
  {
    title: "Sustainable & Local",
    desc: "Encouraging sustainable farming and reducing carbon footprint by promoting local trade.",
    icon: "🌍",
  },
];

const WhyUs = () => {
  return (
    <section className="bg-white py-16 px-6 sm:px-12 lg:px-32" id="why-us">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold text-green-700 mb-8"
        >
          Why Choose Us?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-gray-600 text-lg sm:text-xl mb-12"
        >
          Bridging the gap between farmers and consumers for a healthier and more sustainable future.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * idx, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-green-50 p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

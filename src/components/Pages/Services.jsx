import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: "Contract Farming",
    description: "To maintain the quality of products coming from the farm, we encourage contract farming on a farmer’s field.",
    image: "https://www.hindustantimes.com/ht-img/img/2023/05/16/1600x900/farmers_1684230218799_1684230235644.jpg",
  },
  {
    title: "Partnership with Farmers",
    description: "We directly partner with farmers to ensure fair pricing and genuine income generation for them.",
    image: "https://www.shutterstock.com/image-photo/happy-indian-farmer-using-laptop-600nw-1914043974.jpg",
  },
  {
    title: "Cleaning & Packing",
    description: "We follow hygienic practices to clean and pack your products in eco-friendly packaging.",
    image: "https://img.freepik.com/premium-photo/indian-lady-packing-vegetables-fruits-wooden-box_527904-1423.jpg",
  },
  {
    title: "Delivery of Products",
    description: "We ensure doorstep delivery early in the morning for maximum freshness and convenience.",
    image: "https://img.freepik.com/premium-photo/vegetable-delivery-service-courier-hand-gloves-uniform-holding-wooden-box-full-vegetables-urban-building-background_431015-15128.jpg",
  },
  {
    title: "Care to Your Health",
    description: "Our priority is to provide pesticide-free, organic, and naturally grown products to promote your health.",
    image: "https://img.freepik.com/free-photo/young-woman-holding-organic-vegetables_23-2147682431.jpg",
  },
  {
    title: "High-Quality Products",
    description: "All products undergo multiple quality checks to ensure you're getting the best from our farms.",
    image: "https://img.freepik.com/premium-photo/indian-farmer-examining-quality-paddy-crop_75648-3528.jpg",
  }
];

const Services = () => {
  return (
    <div className="px-4 py-10 md:px-20 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Our <span className="text-green-600">Top Services</span>
      </h2>

      {services.map((service, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`flex flex-col md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} items-center gap-6 mb-16`}
        >
          <img src={service.image} alt={service.title} className="w-full md:w-1/2 rounded-xl shadow-md" />
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-700 text-lg">{service.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Services;

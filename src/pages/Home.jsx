import React from 'react';
import Hero from '../component/home/Hero';
import FeaturedProducts from '../component/home/FeaturedProducts';
import CategoryCards from '../component/home/CategoryCards';
import WhyChooseUs from '../component/home/WhyChooseUs';

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoryCards />
      <WhyChooseUs />
    </>
  );
};

export default Home;
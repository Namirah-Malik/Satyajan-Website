'use client';

import Hero from '@/components/Home/Hero';
import Categories from '@/components/Home/Categories';
import OurServices from '@/components/Home/OurServices';
import Services from '@/components/Home/Services';
import Testimonial from '@/components/Home/Testimonial';
import FAQs from '@/components/Home/FAQs';
import GetInTouch from '@/components/Home/GetInTouch';

export default function HomePageClient() {
  return (
    <main>
      <Hero />
      <Categories />
      <OurServices />
      <Services />
      <Testimonial />
      <FAQs />
      <GetInTouch />
    </main>
  );
}
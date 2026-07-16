import { Helmet } from 'react-helmet-async';
import PageTransition from '../components/common/PageTransition';
import Hero from '../components/home/Hero';
import WhyChoose from '../components/home/WhyChoose';
import Statistics from '../components/home/Statistics';
import FeaturedCourses from '../components/home/FeaturedCourses';
import StudentJourney from '../components/home/StudentJourney';
import TestimonialsSlider from '../components/home/TestimonialsSlider';
import GalleryPreview from '../components/home/GalleryPreview';
import LatestBlogs from '../components/home/LatestBlogs';

const Home = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>Pacific Barista Academy | Premium Barista Training in Pokhara, Nepal</title>
        <meta name="description" content="Pacific Barista Academy offers world-class barista training in Pokhara, Nepal. Learn espresso, latte art, and earn industry-recognized certifications from expert instructors." />
        <link rel="canonical" href="https://www.pacificbarista.com/" />
        <meta property="og:title" content="Pacific Barista Academy | Premium Barista Training" />
        <meta property="og:description" content="World-class barista training in Pokhara, Nepal. Learn espresso, latte art, and earn industry-recognized certifications." />
        <meta property="og:url" content="https://www.pacificbarista.com/" />
        <meta property="og:image" content="https://www.pacificbarista.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pacific Barista Academy | Premium Barista Training" />
        <meta name="twitter:description" content="World-class barista training in Pokhara, Nepal." />
        <meta name="twitter:image" content="https://www.pacificbarista.com/og-image.jpg" />
      </Helmet>
      <Hero />
      <WhyChoose />
      <Statistics />
      <FeaturedCourses />
      <StudentJourney />
      <TestimonialsSlider />
      <GalleryPreview />
      <LatestBlogs />
    </PageTransition>
  );
};

export default Home;

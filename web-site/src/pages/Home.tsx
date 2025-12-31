import { Box } from '@chakra-ui/react';
import FleetGallery from '../components/Landing/FleetGallery';
import Hero from '../components/Landing/Hero';
import LeadForm from '../components/Landing/LeadForm';
import Services from '../components/Landing/Services';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';

const Home = () => {
  return (
    <Box pt={20} bg="midnight.900">
      <Header />
      <Hero />
      <Services />
      <FleetGallery />
      <LeadForm />
      <Footer />
    </Box>
  );
};

export default Home;
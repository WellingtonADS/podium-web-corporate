import { Box } from "@chakra-ui/react";
import {
  FleetGallery,
  Hero,
  LeadForm,
  PromoCarousel,
  Services,
} from "../components";
import { Header, Footer } from "../layouts";

const Home = () => {
  return (
    <Box pt={20} bg="midnight.900">
      <Header />
      <Hero />
      <Services />
      <PromoCarousel />
      <FleetGallery />
      <LeadForm />
      <Footer />
    </Box>
  );
};

export default Home;

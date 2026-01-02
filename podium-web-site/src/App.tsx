import { ChakraProvider } from "@chakra-ui/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import News from "./pages/News";
import ThankYou from "./pages/ThankYou";
import theme from "./theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/novidades" element={<News />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;

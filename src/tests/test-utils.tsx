import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import theme from "../theme";

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ChakraProvider theme={theme}>
      <BrowserRouter>{ui}</BrowserRouter>
    </ChakraProvider>
  );
}

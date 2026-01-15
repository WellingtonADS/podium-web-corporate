import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import theme from "../theme";

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>{ui}</BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export function renderWithProvidersAndClient(
  ui: React.ReactElement,
  queryClient: QueryClient
) {
  return render(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>{ui}</BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

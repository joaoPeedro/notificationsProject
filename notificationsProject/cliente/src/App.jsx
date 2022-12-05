import "./App.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClientGraphqlWsProtocol } from "./components/workers/ClientGraphqlWsProtocol";
import { ClientGraphqlTransportWsProtocol } from "./components/workers/ClientGraphqlTransportWsProtocol";
import { ClientGraphqlTransportWsProtocolWebSocket } from "./components/workers/ClientGraphqlTransportWsProtocolWebSocket";
import { ClientServerSentEvents } from "./components/workers/ClientServerSentEvents";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ClientGraphqlWsProtocol />
      <ClientGraphqlTransportWsProtocol />
      <ClientGraphqlTransportWsProtocolWebSocket />
      <ClientServerSentEvents />
    </QueryClientProvider>
  );
}

export default App;

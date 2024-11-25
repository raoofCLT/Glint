'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type Props = { children: React.ReactNode };

const client = new QueryClient();

const ReactQueryProvider = ({ children }: Props) => {
  return (
    <div>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </div>
  );
};

export default ReactQueryProvider;

import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
// import { Workers } from "../components/workers/Workers";
// import { Workers2 } from "../components/workers/Workers2";
// import { Workers3 } from "../components/workers/Workers3";
// import { Workers4 } from "../components/workers/Workers4";
import { Workers5 } from "../components/workers/Workers5";
import { Test } from "./Test";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export const ReactQuery = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Workers /> */}
      {/* <Workers2 /> */}
      {/* <Workers3 /> */}
      {/* <Workers4 /> */}
      <Workers5 />
      {/* <Test /> */}
    </QueryClientProvider>
  );
};

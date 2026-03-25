import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";

const getQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1, // Will retry failed requests 1 times before displaying an error
      retryDelay: 2000, // Will always wait 2000ms to retry, regardless of how many retries
      staleTime: 60 * 60 * 1000, // 60-minute
    },
  },
});

export default ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={getQueryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

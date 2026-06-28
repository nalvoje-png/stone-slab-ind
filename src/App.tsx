import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import { ConfigGate } from "@/app/ConfigGate";
import { router } from "@/app/router";
import "@/i18n";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ConfigGate>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ConfigGate>
  );
}

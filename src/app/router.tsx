import { createBrowserRouter, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { SignupPage } from "@/features/auth/components/SignupPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { Placeholder } from "@/components/shared/Placeholder";

function Protected({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute><AppShell>{children}</AppShell></ProtectedRoute>;
}

function Soon({ tkey }: { tkey: string }) {
  const { t } = useTranslation();
  return <Placeholder title={t(`nav.${tkey}`)} note={t("dash.soon")} />;
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/", element: <Protected><DashboardPage /></Protected> },
  { path: "/materials", element: <Protected><Soon tkey="materials" /></Protected> },
  { path: "/slabs", element: <Protected><Soon tkey="slabs" /></Protected> },
  { path: "/sales", element: <Protected><Soon tkey="sales" /></Protected> },
  { path: "/orders", element: <Protected><Soon tkey="orders" /></Protected> },
  { path: "/team", element: <Protected><Soon tkey="team" /></Protected> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

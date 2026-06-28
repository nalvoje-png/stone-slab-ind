import type { ReactNode } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { MobileBar } from "./MobileBar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <Topbar />
      <Sidebar />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-5 pb-24 pt-6 lg:pb-10 lg:pt-8">{children}</main>
      </div>
      <MobileBar />
    </div>
  );
}

import type { ReactNode } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { MobileBar } from "./MobileBar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Topbar />
      <Sidebar />
      <div className="lg:pl-[260px]">
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 lg:pb-10 lg:pt-8">{children}</main>
      </div>
      <MobileBar />
    </div>
  );
}

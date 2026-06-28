import { useTranslation } from "react-i18next";
import { isConfigured } from "@/lib/supabase";
import type { ReactNode } from "react";

export function ConfigGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  if (isConfigured) return <>{children}</>;
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="font-display text-h2 text-foreground">{t("config.title")}</h1>
        <p className="mt-3 text-body text-muted-foreground">{t("config.desc")}</p>
      </div>
    </div>
  );
}

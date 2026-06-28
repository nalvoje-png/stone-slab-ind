import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Barra superior azul-marinho que atravessa a tela (estilo Stone Block).
export function Topbar() {
  useTranslation();
  const { user } = useAuth();
  const company = (user?.user_metadata?.company_name as string) ?? user?.email ?? "";
  const initial = (company || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-topbar">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2.5">
          <img src="/logo-icon.png" alt="" className="h-9 w-9 rounded-lg" />
          <span className="text-[20px] font-extrabold tracking-tight text-white">
            Stone Slab <span className="text-blue-300">IND</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20">
            <Check className="h-5 w-5" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-[15px] font-bold text-white">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}

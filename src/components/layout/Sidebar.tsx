import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Package, Layers, ShoppingCart, ClipboardList, Users, LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { signOut } from "@/features/auth/api/auth.api";
import { APP_VERSION } from "@/lib/version";

interface Item { key: string; to: string; icon: LucideIcon; }

const ITEMS: Item[] = [
  { key: "dashboard", to: "/", icon: LayoutDashboard },
  { key: "materials", to: "/materials", icon: Package },
  { key: "slabs", to: "/slabs", icon: Layers },
  { key: "sales", to: "/sales", icon: ShoppingCart },
  { key: "orders", to: "/orders", icon: ClipboardList },
  { key: "team", to: "/team", icon: Users },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  const company = (user?.user_metadata?.company_name as string) ?? user?.email ?? "";

  return (
    <aside className="glass fixed inset-y-3 left-3 top-[76px] hidden w-60 flex-col rounded-3xl lg:flex">
      <div className="px-5 pb-2 pt-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {t("nav.menu", "Menu")}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {ITEMS.map(({ key, to, icon: Icon }) => (
          <NavLink
            key={key}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-semibold transition-colors",
                isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            {t(`nav.${key}`)}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-[14px] font-bold text-primary-foreground">
            {(company || "?").charAt(0).toUpperCase()}
          </div>
          <span className="truncate text-[14px] font-bold text-foreground">{company}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-semibold text-destructive transition-colors hover:bg-destructive-soft"
        >
          <LogOut className="h-[18px] w-[18px]" /> {t("nav.signOut")}
        </button>
        <div className="px-3 pt-2 text-[11px] text-muted-foreground">v{APP_VERSION}</div>
      </div>
    </aside>
  );
}

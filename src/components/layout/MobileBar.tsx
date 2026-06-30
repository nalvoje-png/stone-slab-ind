import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Package, Layers, ShoppingCart, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { key: "dashboard", to: "/", icon: LayoutDashboard },
  { key: "materials", to: "/materials", icon: Package },
  { key: "slabs", to: "/slabs", icon: Layers },
  { key: "sales", to: "/sales", icon: ShoppingCart },
  { key: "orders", to: "/orders", icon: ClipboardList },
];

export function MobileBar() {
  const { t } = useTranslation();
  return (
    <nav className="glass fixed inset-x-3 bottom-3 z-40 flex rounded-2xl px-1 py-1 lg:hidden">
      {ITEMS.map(({ key, to, icon: Icon }) => (
        <NavLink key={key} to={to} end={to === "/"}
          className={({ isActive }) => cn(
            "flex flex-1 flex-col items-center gap-1 rounded-xl py-2",
            isActive ? "bg-primary/15 text-primary" : "text-muted-foreground"
          )}>
          <Icon className="h-[22px] w-[22px]" />
          <span className="text-[10px] font-semibold">{t(`nav.${key}`)}</span>
        </NavLink>
      ))}
    </nav>
  );
}

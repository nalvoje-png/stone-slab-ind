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
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface lg:hidden">
      {ITEMS.map(({ key, to, icon: Icon }) => (
        <NavLink key={key} to={to} end={to === "/"}
          className={({ isActive }) => cn("flex flex-1 flex-col items-center gap-1 py-2.5", isActive ? "text-primary" : "text-muted-foreground")}>
          <Icon className="h-[22px] w-[22px]" />
          <span className="text-[10px] font-semibold">{t(`nav.${key}`)}</span>
        </NavLink>
      ))}
    </nav>
  );
}

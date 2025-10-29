"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, DollarSign, BarChart3, Users } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: Users, label: "Room" },
    { href: "/personal", icon: DollarSign, label: "Personal" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  if (pathname === "/") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-card/80 backdrop-blur-lg border-t border-border md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around md:justify-start md:space-x-8 h-16">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                <span className="text-xs md:text-sm">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, User, Phone, FileUp, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Briefcase, exact: false },
  { href: "/admin/bio", label: "Bio", icon: User, exact: false },
  { href: "/admin/contact", label: "Contact", icon: Phone, exact: false },
  { href: "/admin/resume", label: "Resume / CV", icon: FileUp, exact: false },
  { href: "/admin/account", label: "Account", icon: Settings, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <aside className="w-56 shrink-0 border-r border-white/10 min-h-screen p-5 flex flex-col bg-ink-light">
      <Link href="/" className="text-white font-extrabold text-base tracking-widest mb-8 block hover:text-flame transition-colors">
        ERUSS
      </Link>
      <nav className="flex flex-col gap-0.5 flex-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-flame/10 text-flame font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-red-400 transition-colors mt-4"
      >
        <LogOut size={15} />
        Sign out
      </button>
    </aside>
  );
}

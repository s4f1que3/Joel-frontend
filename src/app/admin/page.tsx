"use client";

import Link from "next/link";
import { Briefcase, User, Phone, FileUp, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const sections = [
  {
    href: "/admin/projects",
    icon: Briefcase,
    label: "Projects",
    description: "Create, edit, and delete projects",
    color: "text-flame bg-flame/10",
  },
  {
    href: "/admin/bio",
    icon: User,
    label: "Bio",
    description: "Edit your biography and personal statement",
    color: "text-flame bg-flame/10",
  },
  {
    href: "/admin/contact",
    icon: Phone,
    label: "Contact",
    description: "Manage your contact information",
    color: "text-flame bg-flame/10",
  },
  {
    href: "/admin/resume",
    icon: FileUp,
    label: "Resume / CV",
    description: "Upload or replace your CV file",
    color: "text-flame bg-flame/10",
  },
  {
    href: "/admin/account",
    icon: Settings,
    label: "Account",
    description: "Change your email and password",
    color: "text-flame bg-flame/10",
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white mb-1">Dashboard</h1>
        <p className="text-white/50 text-sm">
          Welcome back{user?.email ? `, ${user.email}` : ""}.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ href, icon: Icon, label, description, color }) => (
          <Link
            key={href}
            href={href}
            className="group border border-white/10 bg-ink-light rounded-2xl p-6 hover:border-flame/40 transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={18} />
            </div>
            <h2 className="text-white font-semibold text-base group-hover:text-flame transition-colors mb-1">
              {label}
            </h2>
            <p className="text-white/50 text-sm">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

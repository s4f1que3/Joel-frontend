"use client";

import Link from "next/link";
import { FileText, User, Phone, FileUp, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const sections = [
  {
    href: "/admin/articles",
    icon: FileText,
    label: "Articles",
    description: "Create, edit, pin, and delete articles",
    color: "text-primary bg-primary/10",
  },
  {
    href: "/admin/bio",
    icon: User,
    label: "Bio",
    description: "Edit your biography and personal statement",
    color: "text-accent bg-accent/10",
  },
  {
    href: "/admin/contact",
    icon: Phone,
    label: "Contact",
    description: "Manage your contact information",
    color: "text-primary bg-primary/10",
  },
  {
    href: "/admin/resume",
    icon: FileUp,
    label: "Resume / CV",
    description: "Upload or replace your CV file",
    color: "text-accent bg-accent/10",
  },
  {
    href: "/admin/account",
    icon: Settings,
    label: "Account",
    description: "Change your email and password",
    color: "text-primary bg-primary/10",
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Dashboard</h1>
        <p className="text-text-secondary text-sm">
          Welcome back{user?.email ? `, ${user.email}` : ""}.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ href, icon: Icon, label, description, color }) => (
          <Link
            key={href}
            href={href}
            className="group border border-border-color rounded-2xl p-6 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={18} />
            </div>
            <h2 className="text-text-primary font-semibold text-base group-hover:text-primary transition-colors mb-1">
              {label}
            </h2>
            <p className="text-text-secondary text-sm">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

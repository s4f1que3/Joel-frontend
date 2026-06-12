"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ink/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/eruss-mark.png" alt="ERUSS" width={28} height={28} className="h-7 w-auto" priority />
          <span className="text-white font-extrabold text-lg tracking-widest">
            ERUSS
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <a href="/#projects" className="text-white/70 hover:text-white text-sm transition-colors">
            Projects
          </a>
          <a href="/#contact" className="text-white/70 hover:text-white text-sm transition-colors">
            Contact
          </a>
          {user ? (
            <div className="flex items-center gap-5">
              <Link href="/admin" className="text-sm text-flame hover:text-flame-dark transition-colors font-medium">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-flame text-ink font-semibold px-4 py-1.5 rounded-full hover:bg-flame-dark transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

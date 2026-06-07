"use client";

import { AlertTriangle } from "lucide-react";

export default function AdminResumePage() {
  return (
    <div className="p-10 max-w-2xl">
      <h1 className="text-2xl font-semibold text-text-primary mb-1">Resume / CV</h1>
      <p className="text-text-secondary text-sm mb-8">Upload or replace your CV file.</p>

      <div className="border border-amber-200 bg-amber-50 rounded-2xl p-5 flex gap-3">
        <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800 text-sm font-medium mb-1">Backend endpoint missing</p>
          <p className="text-amber-700 text-sm">
            The resume schema exists in Sanity but there is no NestJS controller or service for
            resume uploads yet. Add a <code className="bg-amber-100 px-1 rounded text-xs">resume</code> module to the backend, then this
            section can be wired up.
          </p>
        </div>
      </div>
    </div>
  );
}

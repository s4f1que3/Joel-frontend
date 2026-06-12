"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "password" | "email";

interface PasswordReqs {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
}

function checkPassword(pw: string): PasswordReqs {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

function allMet(reqs: PasswordReqs) {
  return Object.values(reqs).every(Boolean);
}

const REQ_LABELS: { key: keyof PasswordReqs; label: string }[] = [
  { key: "length", label: "At least 8 characters" },
  { key: "upper", label: "One uppercase letter" },
  { key: "lower", label: "One lowercase letter" },
  { key: "number", label: "One number" },
  { key: "special", label: "One special character" },
];

export default function AdminAccountPage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>("password");

  // Password change state
  const [pwForm, setPwForm] = useState({ password: "", new_password: "", confirm: "" });
  const [pwOtpSent, setPwOtpSent] = useState(false);
  const [pwOtp, setPwOtp] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");
  const [showReqs, setShowReqs] = useState(false);

  // Email change state
  const [emailForm, setEmailForm] = useState({ new_email: "" });
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  const pwReqs = checkPassword(pwForm.new_password);

  const sendPasswordOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");

    if (!allMet(pwReqs)) {
      setPwError("New password does not meet the requirements.");
      setShowReqs(true);
      return;
    }
    if (pwForm.new_password !== pwForm.confirm) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwLoading(true);
    try {
      const valid = await authAPI.verifyPassword(user!.email, pwForm.password);
      if (!valid) {
        setPwError("Incorrect current password.");
        return;
      }
      await authAPI.sendOtp(user!.email, pwForm.password);
      setPwOtpSent(true);
    } catch {
      setPwError("Something went wrong. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  const confirmPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError("");
    try {
      await authAPI.changePassword({
        email: user!.email,
        token: pwOtp,
        password: pwForm.password,
        new_password: pwForm.new_password,
      });
      setPwSuccess(true);
      setPwOtpSent(false);
      setPwForm({ password: "", new_password: "", confirm: "" });
      setPwOtp("");
      setShowReqs(false);
    } catch {
      setPwError("Invalid or expired OTP.");
    } finally {
      setPwLoading(false);
    }
  };

  const sendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError("");
    try {
      await authAPI.sendOtp(user!.email, "");
      setEmailOtpSent(true);
    } catch {
      setEmailError("Failed to send OTP");
    } finally {
      setEmailLoading(false);
    }
  };

  const confirmEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError("");
    try {
      await authAPI.changeEmail({
        id: user!.id,
        email: user!.email,
        token: emailOtp,
        new_email: emailForm.new_email,
      });
      updateUser({ email: emailForm.new_email });
      setEmailSuccess(true);
      setEmailOtpSent(false);
      setEmailForm({ new_email: "" });
      setEmailOtp("");
    } catch {
      setEmailError("Invalid or expired OTP");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-lg">
      <h1 className="text-2xl font-semibold text-white mb-1">Account</h1>
      <p className="text-white/50 text-sm mb-8">
        Signed in as <span className="text-white font-medium">{user?.email}</span>
      </p>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8">
        {(["password", "email"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-4 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-flame text-flame"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            Change {t}
          </button>
        ))}
      </div>

      {/* Change Password */}
      {tab === "password" && (
        <div>
          {pwSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-6">
              Password changed successfully.
            </div>
          )}
          {pwError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              {pwError}
            </div>
          )}

          {!pwOtpSent ? (
            <form onSubmit={sendPasswordOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Current password</label>
                <input
                  type="password"
                  value={pwForm.password}
                  onChange={(e) => setPwForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  className="w-full bg-ink-light border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-flame transition-colors placeholder:text-white/30"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">New password</label>
                <input
                  type="password"
                  value={pwForm.new_password}
                  onChange={(e) => {
                    setPwForm((p) => ({ ...p, new_password: e.target.value }));
                    setShowReqs(true);
                  }}
                  required
                  className="w-full bg-ink-light border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-flame transition-colors placeholder:text-white/30"
                  placeholder="••••••••"
                />
                {showReqs && (
                  <ul className="mt-3 space-y-1.5">
                    {REQ_LABELS.map(({ key, label }) => (
                      <li key={key} className={`flex items-center gap-2 text-xs ${pwReqs[key] ? "text-green-400" : "text-white/40"}`}>
                        {pwReqs[key] ? <Check size={11} /> : <X size={11} />}
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirm new password</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                  required
                  className="w-full bg-ink-light border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-flame transition-colors placeholder:text-white/30"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={pwLoading}
                className="bg-flame text-ink px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-flame-dark transition-colors disabled:opacity-50"
              >
                {pwLoading ? "Verifying…" : "Send confirmation code"}
              </button>
            </form>
          ) : (
            <form onSubmit={confirmPasswordChange} className="space-y-4">
              <p className="text-white/50 text-sm">
                A confirmation code was sent to <strong>{user?.email}</strong>. Enter it below.
              </p>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirmation code</label>
                <input
                  type="text"
                  value={pwOtp}
                  onChange={(e) => setPwOtp(e.target.value)}
                  required
                  className="w-full bg-ink-light border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-flame transition-colors tracking-widest placeholder:text-white/30"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="bg-flame text-ink px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-flame-dark transition-colors disabled:opacity-50"
                >
                  {pwLoading ? "Confirming…" : "Confirm change"}
                </button>
                <button
                  type="button"
                  onClick={() => { setPwOtpSent(false); setPwError(""); }}
                  className="text-sm text-white/50 hover:text-white transition-colors px-4"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Change Email */}
      {tab === "email" && (
        <div>
          {emailSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-6">
              Email changed successfully.
            </div>
          )}
          {emailError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              {emailError}
            </div>
          )}

          {!emailSuccess && (
            !emailOtpSent ? (
              <form onSubmit={sendEmailOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">New email address</label>
                  <input
                    type="email"
                    value={emailForm.new_email}
                    onChange={(e) => setEmailForm({ new_email: e.target.value })}
                    required
                    className="w-full bg-ink-light border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-flame transition-colors placeholder:text-white/30"
                    placeholder="new@example.com"
                  />
                </div>
                <p className="text-white/50 text-xs">
                  A confirmation code will be sent to your <strong>current</strong> email address.
                </p>
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="bg-flame text-ink px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-flame-dark transition-colors disabled:opacity-50"
                >
                  {emailLoading ? "Sending…" : "Send confirmation code"}
                </button>
              </form>
            ) : (
              <form onSubmit={confirmEmailChange} className="space-y-4">
                <p className="text-white/50 text-sm">
                  A confirmation code was sent to <strong>{user?.email}</strong>. Enter it below.
                </p>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Confirmation code</label>
                  <input
                    type="text"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    required
                    className="w-full bg-ink-light border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-flame transition-colors tracking-widest placeholder:text-white/30"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="bg-flame text-ink px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-flame-dark transition-colors disabled:opacity-50"
                  >
                    {emailLoading ? "Confirming…" : "Confirm change"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmailOtpSent(false); setEmailError(""); }}
                    className="text-sm text-white/50 hover:text-white transition-colors px-4"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )
          )}
        </div>
      )}
    </div>
  );
}

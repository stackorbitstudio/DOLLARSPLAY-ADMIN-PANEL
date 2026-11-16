
"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleVerification() {
    setError("");
    setMessage("");
    setSending(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      await credential.user.reload();

      if (credential.user.emailVerified) {
        setMessage("Your email is already verified.");
      } else {
        await sendEmailVerification(credential.user);
        setMessage("Verification email sent. Check your Gmail inbox and Spam folder.");
      }

      await signOut(auth);
    } catch {
      setError("Could not send verification email. Check your email and password.");
      if (auth.currentUser) {
        await signOut(auth);
      }
    } finally {
      setSending(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      await credential.user.reload();

      if (!credential.user.emailVerified) {
        await signOut(auth);
        setError("Please verify your email first.");
        return;
      }

      const adminDoc = await getDoc(
        doc(db, "admins", credential.user.uid)
      );

      if (!adminDoc.exists() || adminDoc.data().active !== true) {
        await signOut(auth);
        setError("You are not authorized to access the Admin Panel.");
        return;
      }

      window.location.replace("/dashboard/");
    } catch {
      setError("Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090611] px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-purple-800/50 bg-[#160e27] p-7 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400 text-4xl font-black text-black">
            $
          </div>

          <h1 className="text-3xl font-extrabold text-white">
            DOLLARS<span className="text-lime-400">PLAY</span>
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Private Administration Portal
          </p>
        </div>

        <h2 className="mb-6 text-center text-xl font-bold text-white">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Admin Email
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="h-14 w-full rounded-xl border border-purple-700 bg-[#0c0716] px-4 text-white outline-none focus:border-lime-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="h-14 w-full rounded-xl border border-purple-700 bg-[#0c0716] px-4 text-white outline-none focus:border-lime-400"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-xl bg-lime-400/10 p-3 text-sm text-lime-300">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || sending}
            className="w-full rounded-xl bg-lime-400 py-4 font-bold text-black hover:bg-lime-300 disabled:opacity-50"
          >
            {loading ? "Checking Access..." : "SECURE LOGIN"}
          </button>

          <button
            type="button"
            onClick={handleVerification}
            disabled={loading || sending || !email || !password}
            className="w-full rounded-xl border border-purple-500 py-4 font-semibold text-white hover:bg-purple-900/40 disabled:opacity-50"
          >
            {sending ? "Sending Email..." : "SEND VERIFICATION EMAIL"}
          </button>
        </form>

        <p className="mt-7 text-center text-xs text-gray-500">
          Authorized administrators only.
        </p>
      </div>
    </main>
  );
  }
          

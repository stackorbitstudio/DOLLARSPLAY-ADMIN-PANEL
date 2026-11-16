
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await result.user.reload();

      if (!auth.currentUser?.emailVerified) {
        await signOut(auth);
        setMessage("Please verify your email before logging in.");
        return;
      }

      const adminRef = doc(db, "admins", result.user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists() || adminSnap.data().active !== true) {
        await signOut(auth);
        setMessage("Access denied. Admin account not found or inactive.");
        return;
      }

      router.push("/dashboard/");
    } catch (error: any) {
      setMessage(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerification() {
    setMessage("");

    if (!email || !password) {
      setMessage("Enter your email and password first.");
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await result.user.reload();

      if (auth.currentUser?.emailVerified) {
        setMessage("Your email is already verified.");
      } else {
        await sendEmailVerification(result.user);
        setMessage("Verification email sent. Please check your inbox.");
      }

      await signOut(auth);
    } catch (error: any) {
      setMessage(error.message || "Could not send verification email.");
      if (auth.currentUser) await signOut(auth);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setMessage("");

    if (!email.trim()) {
      setMessage("Enter your email address first.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error: any) {
      setMessage(error.message || "Could not send password reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-purple-500/30 bg-[#111827] p-7 shadow-2xl">
        <h1 className="text-center text-3xl font-bold text-lime-400">
          DOLLARSPLAY
        </h1>

        <h2 className="mt-3 text-center text-xl font-semibold">
          Admin Login
        </h2>

        <p className="mt-2 text-center text-sm text-gray-400">
          Private administration access
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#090611] p-3 text-white outline-none focus:border-lime-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#090611] p-3 text-white outline-none focus:border-lime-400"
          />

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-lg bg-lime-400 p-3 font-bold text-black hover:bg-lime-300 disabled:opacity-50"
          >
            {loading ? "PLEASE WAIT..." : "LOGIN"}
          </button>

          <button
            type="button"
            onClick={handleVerification}
            disabled={loading}
            className="w-full rounded-lg border border-purple-500 p-3 font-semibold text-purple-300 hover:bg-purple-500/10 disabled:opacity-50"
          >
            SEND VERIFICATION EMAIL
          </button>

          {message && (
            <p className="break-words text-center text-sm text-yellow-300">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
    }
        

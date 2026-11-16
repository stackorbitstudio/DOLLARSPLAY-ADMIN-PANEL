
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login/");
        return;
      }

      try {
        await user.reload();

        if (!user.emailVerified) {
          await signOut(auth);
          router.replace("/login/");
          return;
        }

        const adminRef = doc(db, "admins", user.uid);
        const adminSnapshot = await getDoc(adminRef);

        if (!adminSnapshot.exists() || adminSnapshot.data().active !== true) {
          await signOut(auth);
          router.replace("/login/");
          return;
        }

        setAdminEmail(user.email || "");
        setChecking(false);
      } catch {
        await signOut(auth);
        router.replace("/login/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    router.replace("/login/");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090611] text-lime-400">
        Checking Admin Access...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090611] p-5 text-white md:p-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">
            DOLLARS<span className="text-lime-400">PLAY</span>
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Administration Dashboard
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-purple-700 px-5 py-3 text-sm font-bold hover:bg-purple-900"
        >
          Logout
        </button>
      </header>

      <section className="mb-8 rounded-2xl border border-purple-800/50 bg-[#160e27] p-6">
        <p className="text-sm text-gray-400">Welcome, Administrator</p>
        <h2 className="mt-2 break-all text-xl font-bold">{adminEmail}</h2>
        <p className="mt-3 text-sm text-lime-400">
          Admin access verified successfully.
        </p>
      </section>

      <section>
        <h2 className="mb-5 text-xl font-bold">Control Center</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "User Management",
            "Wallet Management",
            "Withdrawal Management",
            "Games Management",
            "Tasks Management",
            "Referral Management",
            "Coin Conversion Rates",
            "Reports & Analytics",
            "Platform Settings",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-purple-800/50 bg-[#160e27] p-6"
            >
              <h3 className="font-bold">{item}</h3>
              <p className="mt-2 text-sm text-gray-500">
                Module setup pending
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
            }
      


"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

type UserRecord = {
  uid: string;
  displayName?: string;
  email?: string;
  accountStatus?: string;
  country?: {
    name?: string;
    currencyCode?: string;
  };
  createdAt?: any;
};

export default function UserManagementPage() {
  const router = useRouter();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (admin) => {
      if (!admin || !admin.emailVerified) {
        router.replace("/login/");
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, "users"));

        const userList = snapshot.docs.map((item) => ({
          uid: item.id,
          ...item.data(),
        })) as UserRecord[];

        setUsers(userList);
      } catch (err) {
        console.error("Users loading error:", err);
        setError("Unable to load users. Check Firestore permissions.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return users;

    return users.filter((user) =>
      `${user.displayName || ""} ${user.email || ""} ${user.uid}`
        .toLowerCase()
        .includes(term)
    );
  }, [users, search]);

  const activeUsers = users.filter(
    (user) => user.accountStatus === "active"
  ).length;

  return (
    <main className="min-h-screen bg-[#090611] p-4 text-white md:p-8">
      <header className="mb-8">
        <button
          onClick={() => router.push("/dashboard/")}
          className="mb-5 rounded-lg border border-purple-700 px-4 py-2 text-sm hover:bg-purple-900/30"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold">
          User <span className="text-lime-400">Management</span>
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          View and manage registered platform users.
        </p>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-purple-800/50 bg-[#160e27] p-5">
          <p className="text-sm text-gray-400">Total Registered Users</p>
          <p className="mt-2 text-3xl font-bold text-lime-400">
            {users.length}
          </p>
        </div>

        <div className="rounded-xl border border-purple-800/50 bg-[#160e27] p-5">
          <p className="text-sm text-gray-400">Active Users</p>
          <p className="mt-2 text-3xl font-bold text-green-400">
            {activeUsers}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-purple-800/50 bg-[#110b1d] p-4 md:p-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or UID..."
          className="mb-6 w-full rounded-xl border border-purple-800 bg-[#090611] p-4 text-white outline-none focus:border-lime-400"
        />

        {loading ? (
          <p className="py-10 text-center text-lime-400">
            Loading users...
          </p>
        ) : error ? (
          <p className="py-10 text-center text-yellow-300">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="py-10 text-center text-gray-400">
            No users found.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <article
                key={user.uid}
                className="rounded-xl border border-purple-900/50 bg-[#160e27] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-words font-bold">
                      {user.displayName || "Unnamed User"}
                    </h2>

                    <p className="mt-1 break-all text-sm text-gray-400">
                      {user.email || "No email"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.accountStatus === "active"
                        ? "bg-green-900/40 text-green-400"
                        : "bg-red-900/40 text-red-400"
                    }`}
                  >
                    {user.accountStatus || "Unknown"}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-400">
                  <p>
                    <span className="text-gray-300">Country:</span>{" "}
                    {user.country?.name || "Not set"}
                  </p>

                  <p>
                    <span className="text-gray-300">Currency:</span>{" "}
                    {user.country?.currencyCode || "Not set"}
                  </p>

                  <p>
                    <span className="text-gray-300">UID:</span>
                    <span className="ml-1 break-all">{user.uid}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
    }
        

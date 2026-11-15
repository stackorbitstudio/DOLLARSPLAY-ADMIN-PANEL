
"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  ListChecks,
  Wallet,
  Banknote,
  Settings,
  Bell,
  Search,
  Menu,
  ShieldCheck,
  Activity,
  ArrowUpRight,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Users", icon: Users },
  { name: "Games", icon: Gamepad2 },
  { name: "Tasks", icon: ListChecks },
  { name: "Wallets", icon: Wallet },
  { name: "Withdrawals", icon: Banknote },
  { name: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { title: "Total Users", value: "—", icon: Users },
    { title: "Active Games", value: "—", icon: Gamepad2 },
    { title: "Total Coin Balance", value: "—", icon: Wallet },
    { title: "Pending Withdrawals", value: "—", icon: Banknote },
  ];

  return (
    <main className="min-h-screen bg-[#090611] text-white">
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-purple-900/40 bg-[#110b1e] transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-purple-900/40 px-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400 text-2xl font-black text-black">
            $
          </div>
          <div>
            <h1 className="font-extrabold tracking-wide">
              DOLLARS<span className="text-lime-400">PLAY</span>
            </h1>
            <p className="text-xs text-gray-500">ADMIN PANEL</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-gray-500">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const selected = activeMenu === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  selected
                    ? "bg-lime-400 text-black"
                    : "text-gray-400 hover:bg-purple-900/30 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="m-4 rounded-xl border border-purple-800/40 bg-purple-950/30 p-4">
          <ShieldCheck className="mb-2 text-lime-400" size={24} />
          <p className="text-sm font-bold">Private Admin Area</p>
          <p className="mt-1 text-xs text-gray-500">
            Authorized access only
          </p>
        </div>
      </aside>

      <section className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-purple-900/40 bg-[#090611]/95 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-300 hover:bg-purple-900/30 lg:hidden"
            >
              <Menu size={23} />
            </button>
            <div>
              <h2 className="text-lg font-bold sm:text-xl">
                {activeMenu}
              </h2>
              <p className="text-xs text-gray-500">
                DOLLARSPLAY Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="rounded-xl border border-purple-900/50 p-3 text-gray-400 hover:text-lime-400"
            >
              <Bell size={19} />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400 font-bold text-black">
              A
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-lime-400">
              CONTROL CENTER
            </p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Welcome to Admin Panel
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Manage your DOLLARSPLAY platform from one place.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-purple-900/40 bg-[#160e27] p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      {stat.title}
                    </p>
                    <Icon className="text-lime-400" size={22} />
                  </div>
                  <p className="mt-5 text-3xl font-extrabold">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Awaiting Firebase connection
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-purple-900/40 bg-[#160e27] p-6">
              <div className="flex items-center gap-3">
                <Activity className="text-lime-400" size={23} />
                <h3 className="font-bold">Platform Activity</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-gray-400">
                Your platform activity and latest updates will appear here
                after Firebase integration.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-900/40 bg-[#160e27] p-6">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="text-lime-400" size={23} />
                <h3 className="font-bold">Quick Management</h3>
              </div>
              <div className="mt-5 space-y-3">
                {["Users Management", "Games Management", "Withdrawal Requests"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-purple-900/40 bg-[#0d0817] p-4 text-sm text-gray-300"
                    >
                      {item}
                      <span className="float-right text-xs text-lime-400">
                        Coming Soon
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-gray-600">
            DOLLARSPLAY Admin Panel · Development Version
          </p>
        </div>
      </section>
    </main>
  );
}
  

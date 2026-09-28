import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import {
  MessageSquare,
  Files,
  Brain,
  Settings,
  Shield,
} from "lucide-react"

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const links = [
    {
      name: "Chat",
      path: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: Files,
    },
    {
      name: "Memory",
      path: "/memory",
      icon: Brain,
    },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">

      <aside className="w-64 border-r border-white/10 bg-[#0c0c0f] flex flex-col">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center">
              <Shield size={18} />
            </div>

            <span className="font-semibold tracking-wide">
              VIBKED
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-white/10">

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>

          {/* Local AI status */}
          <div className="mt-4 px-3 py-3 rounded-lg bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs text-zinc-300">
                Local AI
              </span>
            </div>

            <p className="text-[11px] text-zinc-500 mt-1">
              Connected
            </p>
          </div>

        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>

    </div>
  )
}

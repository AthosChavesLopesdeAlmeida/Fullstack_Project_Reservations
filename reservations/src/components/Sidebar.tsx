'use client'
import { apiFetch } from "@/lib/fetcher";
import { useState, useEffect } from "react";
import Link from "next/link";

type User = { userId: string; name: string; role: string };
type Link = { href: string, label: string}

export const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserName = async () => {
    const res = await apiFetch('/api/me', {method: 'GET'})
    if (res.ok) {
      const data = await res.json()
      setUser(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUserName()
  }, [])

  if (loading || !user) return null;

  const links = [
    { href: "/", label: "Home" },
    { href: "/rooms", label: "Salas" },
    { href: "/reservations", label: "Minhas reservas" },
    { href: "/me", label: "Minha conta"}
  ];

  const adminLinks = [
    { href: "/admin/rooms", label: "Gerenciar salas" },
    { href: "/admin/reservations", label: "Gerenciar reservas" },
  ];

  return (
    <div>
      <nav className="w-56 h-screen bg-[#2b2d31] border-r border-[#232428] flex flex-col p-4 gap-1">
        {links.map((link: Link) => (
          <Link 
          key={link.href}
          href={link.href}
          className="px-3 py-2 rounded text-sm font-medium transition-colors text-[#949ba4] hover:bg-[#35373c] hover:text-white">
            {link.label}
          </Link>
        ))}

        {user.role === 'ADMIN' && (
          <>
            {adminLinks.map((link: Link) => (
              <Link 
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded text-sm font-medium transition-colors text-[#949ba4] hover:bg-[#35373c] hover:text-white">
                {link.label}
              </Link>
            ))}
          </>
        )}
      </nav>
    </div>
  )
}

export default Sidebar
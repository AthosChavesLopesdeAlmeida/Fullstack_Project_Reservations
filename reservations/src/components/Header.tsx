'use client'
import { apiFetch } from '@/lib/fetcher'
import { useState, useEffect } from 'react'
type User = { userId: string; name: string; role: string };

export const Header = () => {
  const [user, setUser] = useState<User | null>(null)

  const fetchUserName = async () => {
    const res = await apiFetch('/api/me', {method: 'GET'})
    if (!res.ok) return;
    const data = await res.json()
    setUser(data)
  }

  useEffect(() => {
    fetchUserName()
  }, [])

  return (
    <div>
      <header className="bg-[#1e1f22] border-b border-[#232428] px-6 py-4 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
          <span className="text-[#5865f2]">✓</span> Reservations
        </h2>
        {user && (
          <h2 className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
            Olá, {user.name}!
          </h2>
        )}
      </header>
    </div>
  )
}

export default Header
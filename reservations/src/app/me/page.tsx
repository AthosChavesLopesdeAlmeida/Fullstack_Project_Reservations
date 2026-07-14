'use client'
import { apiFetch } from "@/lib/fetcher"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User } from "@/types/user"

const Page = () => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const fetchUser = async () => {
    const res = await apiFetch('/api/me', {method: 'GET'})
    if (!res.ok) return
    const data = await res.json()
    setUser(data)
  }

  const logoutFunction  = async () => {
    const res = await apiFetch('/api/auth/logout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    })
    if (!res.ok) return
    router.push('/login')
  }

  const deleteAccount = async () => {
    const res = await apiFetch('/api/auth/delete', {
      method: 'DELETE'
    })
    if (!res.ok) return
    router.push('/login')
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 mb-10">
      {user && (
        <>
        <section className="bg-[#2b2d31] border border-[#232428] rounded-lg p-6 shadow-sm mb-6 flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-white">{user.name}</h3>
          <p className="text-sm text-[#949ba4]">{user.email}</p>
          <p className="text-sm text-[#949ba4]">{user.role}</p>

          <span className="text-xs text-[#6d6f78] mt-2">Conta criada em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
          <span className="text-xs text-[#6d6f78]">Seu id: {user.id}</span>
        </section>

        <section className="flex gap-4">
          <button onClick={() => logoutFunction()}
          className="text-[#949ba4] text-sm font-medium hover:underline hover:text-white transition-colors">
            Logout
          </button>

          <button onClick={() => deleteAccount()}
          className="text-[#da373c] text-sm font-medium hover:underline hover:text-[#f23f43] transition-colors">
            Delete account
          </button>
        </section>
        </>
      )}
    </div>
  )
}

export default Page
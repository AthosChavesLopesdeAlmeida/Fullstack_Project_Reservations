'use client'
import { apiFetch } from "@/lib/fetcher";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Reservation } from "@/types/reservations";

type User = { userId: string; name: string; role: string };

const Page = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterRoom, setFilterRoom] = useState("")
  const [filterUser, setFilterUser] = useState("")
  const router = useRouter()

  const fetchReservations = async () => {
    const res = await apiFetch('/api/reservations', { method: 'GET' })
    if (!res.ok) return
    const data = await res.json()
    setReservations(Array.isArray(data) ? data : [])
  }

  const fetchUser = async () => {
    const res = await apiFetch("/api/me", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchReservations()
    fetchUser()
  }, [])

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [loading, user, router]);

  const cancelReservation = async (id: string) => {
    const res = await apiFetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELED" }),
    });
    if (!res.ok) return;
    await fetchReservations();
  }

  const filtered = reservations.filter((r) => {
    const matchRoom = filterRoom ? r.room.name.toLowerCase().includes(filterRoom.toLowerCase()) : true
    const matchUser = filterUser ? r.user.name.toLowerCase().includes(filterUser.toLowerCase()) : true
    return matchRoom && matchUser
  })

  if (loading || user?.role !== "ADMIN") return null;
  
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 mb-10">
      <h3 className="text-lg font-bold text-white mb-4">Todas as reservas</h3>

      <div className="flex gap-3 mb-6">
        <input
          placeholder="Filtrar por sala"
          value={filterRoom}
          onChange={(e) => setFilterRoom(e.target.value)}
          className="bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] placeholder-[#949ba4] focus:outline-none focus:ring-2 focus:ring-[#5865f2] flex-1"
        />
        <input
          placeholder="Filtrar por usuário"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] placeholder-[#949ba4] focus:outline-none focus:ring-2 focus:ring-[#5865f2] flex-1"
        />
      </div>

      <section className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="text-sm text-[#949ba4]">Nenhuma reserva encontrada.</p>
        )}
        {filtered.map((reser) => {
          const isCancelled = String(reser.status) === "CANCELED";
          return (
            <div key={reser.id} className="bg-[#2b2d31] border border-[#232428] rounded-lg p-4 flex justify-between items-center hover:bg- [#2e3035] transition-colors shadow-sm">
              <div className="flex flex-col gap-1">
                <h5 className={isCancelled ? 'line-through text-[#949ba4] opacity-60 font-medium' : 'font-semibold text-white text-base'}>
                  {reser.room.name}
                </h5>
                <span className="text-xs text-[#949ba4]">
                  {reser.user.name} — {new Date(reser.startTime).toLocaleString("pt-BR")} até {new Date(reser.endTime).toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-[#949ba4]">
                  {isCancelled ? "Cancelada" : "Confirmada"}
                </span>
                {!isCancelled && (
                  <button
                    onClick={() => cancelReservation(reser.id)}
                    className="text-[#da373c] text-sm font-medium hover:underline hover:text-[#f23f43] transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  )
}

export default Page
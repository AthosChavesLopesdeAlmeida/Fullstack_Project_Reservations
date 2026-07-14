'use client'
import { apiFetch } from "@/lib/fetcher";
import { useState, useEffect } from "react";
import { Reservation } from "@/types/reservations";

const Page = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])

  const fetchReservations = async () => {
    const res = await apiFetch('/api/reservations', {method: 'GET'})
    if (!res.ok) return
    const data = await res.json()
    setReservations(Array.isArray(data) ? data : [])
  }

  const deleteReservation = async (id: string) => {
    const res = await apiFetch(`/api/reservations/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) return;
    setReservations(reservations.filter((r) => r.id !== id))
    await fetchReservations()
  }

  const cancelReservation = async (id: string) => {
    const res = await apiFetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    if (!res.ok) return;
    await fetchReservations();
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const now = new Date();
  const upcoming = reservations
    .filter((r) => r.status === "CONFIRMED" && new Date(r.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);


  return (
    <div>
      <section className='grid grid-cols-2 gap-4 p-4'>
        {upcoming.length === 0 && (
          <h1 className=" text-lg font-bold text-white col-span-2">Nenhuma reserva futura.</h1>
        )}
        {upcoming.map((reser: Reservation) => {
          return (
          <div key={reser.id} 
          className="bg-[#2b2d31] border border-[#232428] rounded-lg p-4 flex flex-col gap-6 shadow-sm">
            <div className="flex flex-col gap-3 max-w-[70%]">
              <h4 className="font-semibold text-white text-base">
                {String(reser.room.name)}
              </h4>
                <p className="text-sm text-[#949ba4]">{reser.status}</p>
                <p className="text-sm text-[#949ba4]">Das {new Date(reser.startTime).toLocaleString('pt-BR')}</p>
                <p className="text-sm text-[#949ba4]">Até {new Date(reser.endTime).toLocaleDateString('pt-BR')}</p>
            </div>
            <button onClick={() => cancelReservation(reser.id)}
            className=" bg-[#818589] text-white px-3 py-2 rounded text-sm font-medium transition-colors text-[#949ba4] hover:bg-[#A49A87] cursor-pointer">
              Cancelar reserva
            </button>
            <button onClick={() => deleteReservation(reser.id)}
            className=" bg-[#CD1C18] text-white px-3 py-2 rounded text-sm font-medium transition-colors text-[#949ba4] hover:bg-[#B22222] cursor-pointer">
              Excluir reserva
            </button>
          </div>
          )
        })}
      </section>   
    </div>
  )
}

export default Page
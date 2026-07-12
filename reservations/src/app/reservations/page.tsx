'use client'
import { apiFetch } from "@/lib/fetcher";
import { Status } from "@/types/reservations";
import { Reservation } from "@/types/reservations";
import { useState, useEffect } from 'react'
import React from 'react'

type Room = { id: string; name: string };

const Page = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomId, setRoomId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const fetchReservations = async () => {
    const res = await apiFetch('/api/reservations', { method: 'GET' })
    if (!res.ok) {
      const data = await res.json()
      setError(data.message)
      return
    }
    const data = await res.json()
    setReservations(data)
  }

  const fetchRooms = async () => {
    const res = await apiFetch('/api/rooms', { method: 'GET' })
    if (!res.ok) return
    const data = await res.json()
    setRooms(data)
  }

  const deleteReservation = async (id: string) => {
    const res = await apiFetch(`/api/reservations/${id}`, { method: 'DELETE' })
    if (!res.ok) return
    setReservations(reservations.filter((reser) => reser.id !== id))
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const res = await apiFetch('/api/reservations', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, startTime, endTime })
    })

    if (!res.ok) {
      const data = await res.json();
      if (res.status === 409) {
        setError("Horário indisponível para esta sala. Escolha outro intervalo.");
      } else {
        setError(data.message || "Erro ao criar reserva");
      }
      return;
    }

    setRoomId("");
    setStartTime("");
    setEndTime("");
    await fetchReservations()
  }

  async function cancelReservation(id: string) {
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
    fetchRooms()
  }, [])

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 mb-10">
      <section className="mb-8 bg-[#2b2d31] p-6 rounded-lg shadow-md border border-[#232428]">
        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider text-sm">Nova reserva</h3>
        <form onSubmit={submitForm} className='flex flex-col gap-3'>

          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-all"
          >
            <option value="">Selecione uma sala</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>

          <input type="datetime-local" placeholder='Starting time'
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] placeholder-[#949ba4] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-all" />

          <input type="datetime-local" placeholder='Ending time'
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] placeholder-[#949ba4] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-all" />

          <button type='submit' className="bg-[#5865f2] text-white font-medium rounded-md px-4 py-2.5 hover:bg-[#4752c4] active:bg-[#3c45a5] transition-colors shadow-sm mt-1">
            Create reservation
          </button>
        </form>

        {error && (
          <p className="text-[#da373c] text-sm font-medium">
            {error}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        {reservations.map((reser: Reservation) => {
          const isCancelled = reser.status === Status.CANCELED;

          return (
            <div key={reser.id} className="bg-[#2b2d31] border border-[#232428] rounded-lg p-4 flex justify-between items-center hover:bg-[#2e3035] transition-colors shadow-sm">
              <div className="flex flex-col gap-1 max-w-[70%]">
                <h5 className={isCancelled ? 'line-through text-[#949ba4] opacity-60 font-medium' : 'font-semibold text-white text-base'}>
                  {reser.room.name}
                </h5>
                <span className="text-xs text-[#949ba4]">
                  {new Date(reser.startTime).toLocaleString("pt-BR")} — {new Date(reser.endTime).toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-[#949ba4]">
                  {isCancelled ? "Cancelada" : "Confirmada"}
                </span>

                {!isCancelled && (
                  <button
                    onClick={() => cancelReservation(reser.id)}
                    className="text-[#da373c] text-sm font-medium hover:underline hover:text-[#f23f43] transition-colors">
                    Cancelar
                  </button>
                )}

                <button
                  onClick={() => deleteReservation(reser.id)}
                  className="text-[#949ba4] text-sm font-medium hover:underline hover:text-[#f23f43] transition-colors">
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  )
}

export default Page
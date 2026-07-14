'use client'
import { apiFetch } from "@/lib/fetcher";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Room } from "@/types/rooms";

type User = { userId: string; name: string; role: string };

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchRoom = async () => {
    const res = await apiFetch(`/api/rooms/${id}`, { method: "GET" });
    if (!res.ok) return;
    const data: Room = await res.json();
    setRoom(data);
  };

  const fetchUser = async () => {
    const res = await apiFetch("/api/me", { method: "GET" });
    if (!res.ok) return;
    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    fetchRoom();
    fetchUser();
  }, [id]);

  const submitReservation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const res = await apiFetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: id, startTime, endTime }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (res.status === 409) {
        setError("Horário indisponível para esta sala. Escolha outro intervalo.");
      } else {
        setError(data.message || "Erro ao criar reserva");
      }
      return;
    }

    setStartTime("");
    setEndTime("");
    await fetchRoom();
  };

  const toggleActive = async () => {
    if (!room) return;
    const res = await apiFetch(`/api/rooms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !room.isActive }),
    });
    if (!res.ok) return;
    await fetchRoom();
  };

  const deleteRoom = async () => {
    const res = await apiFetch(`/api/rooms/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    router.push("/rooms");
  };

  if (!room) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 mb-10">
      <section className="flex flex-col bg-[#2b2d31] border border-[#232428] rounded-lg p-6 shadow-sm mb-6 gap-4">
        <h3 className={room.isActive ? "text-2xl font-bold text-white" : "text-2xl font-bold text-[#949ba4] line-through opacity-60"}>
          {room.name}
        </h3>
        <p className="text-sm text-[#949ba4] mt-2">{room.description}</p>
        <p className="text-sm text-[#949ba4]">{room.location}</p>
        <p className="text-sm text-[#949ba4]">Capacidade: {room.capacity}</p>

        {user?.role === "ADMIN" && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-[#232428]">
            <button onClick={toggleActive}
              className="text-[#949ba4] text-sm font-medium hover:underline hover:text-white transition-colors">
              {room.isActive ? "Marcar como inativa" : "Marcar como ativa"}
            </button>
            <button onClick={deleteRoom}
              className="text-[#da373c] text-sm font-medium hover:underline hover:text-[#f23f43] transition-colors">
              Excluir sala
            </button>
          </div>
        )}
      </section>

      {room.isActive && (
        <section className="bg-[#2b2d31] border border-[#232428] rounded-lg p-6 shadow-sm">
          <h4 className="text-sm font-bold text-[#b5bac1] uppercase tracking-wider mb-3">Reservar esta sala</h4>
          <form onSubmit={submitReservation} className="flex flex-col gap-3">
            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)}
              className="bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865f2]" />
            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)}
              className="bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] focus:outline-none focus:ring-2 focus:ring-[#5865f2]" />
            <button type="submit" className="bg-[#5865f2] text-white font-medium rounded-md px-4 py-2.5 hover:bg-[#4752c4] transition-colors">
              Reservar
            </button>
          </form>
          {error && <p className="text-[#da373c] text-sm font-medium mt-2">{error}</p>}
        </section>
      )}
    </div>
  );
};

export default Page;
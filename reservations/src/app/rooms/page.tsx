'use client'
import { apiFetch } from "@/lib/fetcher";
import { useState, useEffect } from "react";
import { Room } from "@/types/rooms";
import Link from "next/link"; 

const Page = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const activeRooms = rooms.filter((room) => room.isActive)

  const fetchRooms = async () => {
    const res = await apiFetch('/api/rooms', {
      method: 'GET'
    })
    if (!res.ok) return
    const data = await res.json()
    setRooms(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  return (
    <div>
      <section className='grid grid-cols-2 gap-4 p-4'>
        {activeRooms.map((room: Room) => {
          return (
          <div key={room.id} 
          className="bg-[#2b2d31] border border-[#232428] rounded-lg p-4 flex flex-col gap-6 shadow-sm">
            <div className="flex flex-col gap-3 max-w-[70%]">
              <h4 className="font-semibold text-white text-base">
                {room.name}
              </h4>
                <p className="text-sm text-[#949ba4]">{room.description}</p>
                <p className="text-sm text-[#949ba4]">{room.location}</p>
                <p className="text-sm text-[#949ba4]">Capacity: {room.capacity}</p>
            </div>
            <Link href={`/rooms/${room.id}`}
            className=" bg-[#0080FF] text-white px-3 py-2 rounded text-sm font-medium transition-colors text-[#949ba4] hover:bg-[#0050FF]cursor-pointer">
              Detalhes
            </Link>
          </div>
          )
        })}
      </section>
    </div>
  )
}

export default Page
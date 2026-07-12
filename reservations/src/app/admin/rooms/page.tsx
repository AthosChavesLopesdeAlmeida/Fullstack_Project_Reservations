'use client'
import { Room } from '@/types/rooms'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/fetcher'

const Page = () => {
  const [capacity, setCapacity] = useState(0)
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  const [rooms, setRooms] = useState<Room[]>([])
  const [error, setError] = useState('')

  const fetchRooms = async () => {
    const res = await apiFetch('/api/rooms', {
      method: 'GET'
    })
    const data = await res.json()
    setRooms(Array.isArray(data) ? data : [])
  }

  const submitForm = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const res = await apiFetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name, capacity, location, description})
    })
    const data = await res.json()
    
    if (!res.ok) {
      setError(data.message)
      return 
    }
    
    setCapacity(0)
    setDescription('')
    setName('')
    setLocation('')
  }

  const deleteRoom = async (id: string) => {
    const res = await apiFetch(`/api/rooms/${id}`, {
      method: 'DELETE'
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      return 
    }

    setRooms(rooms.filter((room) => room.id !== id))
  }

  const switchRoomState = async (id: string, currentStatus: boolean) => {
    await apiFetch(`/api/rooms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: !currentStatus })
    })
    fetchRooms()
  }


  useEffect(() => {
    fetchRooms()
  }, [])

  return (
    <div className="max-w-md mx-auto mt-20 px-4">

      <section className="bg-[#2b2d31] p-8 rounded-lg shadow-lg border border-[#232428]">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Create an account</h3>
        </div>
        
        <form onSubmit={(e) => submitForm(e)} className="flex flex-col gap-4 text-left">
          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">Capacity</label>
            <input type="number" onChange={(e) => setCapacity(Number(e.target.value))} placeholder=''
            className="w-full bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] placeholder-[#4e5058] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">Description</label>
            <input type="text" onChange={(e) => setDescription(e.target.value)} placeholder=''
            className="w-full bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] placeholder-[#4e5058] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">Location</label>
            <input type="text" onChange={(e) => setLocation(e.target.value)} placeholder=''
            className="w-full bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] placeholder-[#4e5058] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">Room name</label>
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder=''
            className="w-full bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] placeholder-[#4e5058] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-all"/>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type='submit' 
          className="w-full bg-[#5865f2] text-white font-medium rounded-md py-3 hover:bg-[#4752c4] active:bg-[#3c45a5] transition-colors mt-2 shadow-md">
            Create room
          </button>
        </form>
      </section>

      <section className='grid grid-cols-2 gap-4 p-4'>
        {rooms.map((room: Room) => {
          return (
          <div key={room.id}>
            <div className="flex flex-col gap-1 max-w-[70%]">
              <h4 className={!room.isActive ? 'line-through text-[#949ba4] opacity-60 font-medium' : 'font-semibold text-white text-base'}>
                {room.name}
              </h4>
                <p className="text-sm text-[#949ba4]">{room.description}</p>
                <p className="text-sm text-[#949ba4]">{room.location}</p>
                <p className="text-sm text-[#949ba4]">Capacity: {room.capacity}</p>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-[#949ba4] hover:text-[#f2f3f5] transition-colors">
                <input type="checkbox" name="switch" id={`switch-${room.id}`}
                onChange={() => switchRoomState(room.id, room.isActive)} 
                checked={room.isActive} 
                className="w-4 h-4 rounded bg-[#1e1f22] border-[#232428] text-[#5865f2] focus:ring-[#5865f2] focus:ring-offset-0 accent-[#5865f2]"/>
                <span>{room.isActive ? 'Active' : 'Mark as active'}</span>
              </label>

              <button onClick={() => deleteRoom(room.id)} className="text-[#da373c] text-sm font-medium hover:underline hover:text-[#f23f43] transition-colors">
                Delete room
              </button>
            </div>
          </div>
          )
        })}
      </section>
    </div>
  )
}

export default Page
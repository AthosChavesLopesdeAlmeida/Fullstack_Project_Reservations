'use client'
import { useState } from 'react'
import { apiFetch } from '@/lib/fetcher'
import { useRouter } from 'next/navigation'

const Page = () => {
  const [capacity, setCapacity] = useState(0)
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

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
    router.push('/rooms')
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-4">

      <section className="bg-[#2b2d31] p-8 rounded-lg shadow-lg border border-[#232428]">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Registre uma sala</h3>
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
    </div>
  )
}

export default Page
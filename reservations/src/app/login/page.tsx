'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Page = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const submitForm = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, password})
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      return 
    }
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-[#2b2d31] p-8 rounded-lg shadow-lg border border-[#232428] text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Welcome back!</h3>
        <p className="text-[#949ba4] text-sm mb-6">We are so excited to see you again!</p>
        
        <form onSubmit={(e) => submitForm(e)} className="flex flex-col gap-4 text-left">
          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">Email</label>
            <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder='Type your email'
            className="w-full bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] placeholder-[#4e5058] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder='Type your password'
            className="w-full bg-[#1e1f22] border border-[#232428] rounded px-4 py-2.5 text-[#f2f3f5] placeholder-[#4e5058] focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-all"/>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type='submit' 
          className="w-full bg-[#5865f2] text-white font-medium rounded-md py-3 hover:bg-[#4752c4] active:bg-[#3c45a5] transition-colors mt-2 shadow-md">
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Page
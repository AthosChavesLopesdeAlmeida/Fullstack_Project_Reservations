'use client'
import React from 'react'
import { getUserFromRequest } from '@/lib/auth'

export const Header = () => {

  return (
    <div>
      <header className="bg-[#1e1f22] border-b border-[#232428] px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
          <span className="text-[#5865f2]">✓</span> Todo List
        </h1>
      </header>
    </div>
  )
}

export default Header
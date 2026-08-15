"use client";
import React, { useEffect, useState } from 'react'
import { useUserActions } from '../actions/user'
import { useUserStore } from '../store/userStore'
import Logo from '../assets/mickey-logo.png'

export default function DataRoute({ children }) {

  const { getSettings, getAllProducts } = useUserActions()
  const { settings, loaded, setLoaded } = useUserStore()

  const [loading, setLoading] = useState(false)

  async function fetchData() {
    setLoading(true)
    await getSettings()
    await getAllProducts()
    setLoaded(true)
    setLoading(false)
  }

  useEffect(() => {
    if (!loaded)
      fetchData()
  }, [])

  if (loading) return <Loader />

  return <>{children}</>
}

const Loader = () => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-[#0a0a0a] flex flex-col justify-center items-center select-none" >
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-[radial-gradient(circle,_rgba(212,175,55,0.15)_0%,_transparent_70%)] animate-pulse rounded-full blur-xl pointer-events-none" />
        <img 
          className="animate-pulse w-[100px] object-contain relative z-10 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.25)]" 
          src={Logo.src || Logo} 
          alt="Mickey Crackers" 
        />
      </div>
      <div className="w-8 h-8 rounded-full border-[3px] border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin mb-4" />
      <p className="text-[#D4AF37] text-xs font-mono tracking-[0.25em] uppercase animate-pulse">Loading Store</p>
    </div>
  )
}

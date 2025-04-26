import Navbar from '@/components/ui/navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}

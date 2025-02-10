"use client"

import React from 'react'
import LeftSidebar from './component/LeftSidebar'
import Home from './component/home'
import Dashboard from './myapp/dashboard'

const page = () => {
  return (
    <div>
        <LeftSidebar/>
        <Dashboard/>
    </div>
  )
}

export default page
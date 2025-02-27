"use client"

import React, { Suspense } from 'react'
import TaskChat from './TaskChat'

const page = () => {
  return (
    <>
      <Suspense fallback={<div className="h-[80vh] flex justify-center items-center">
        <div
          className="w-12 h-12 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
        ></div>

      </div>}>
        <TaskChat />
      </Suspense>
    </>
  )
}

export default page
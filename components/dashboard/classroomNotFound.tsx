"use client"
import React from 'react'
import {useRouter} from "nextjs-toploader/app";

export default function ClassroomNotFound() {
    const router = useRouter();
  return (
    <div className="p-6 text-red-600 flex flex-col items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
        <p>Classroom not found </p>
        <button onClick={()=> router.back()} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Go Back</button>
        </div>
  )
}

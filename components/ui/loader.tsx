"use client";
import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import BubbleBlob from './bubbleBlob';

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-50">
      <BubbleBlob/>
       <DotLottieReact
      src="/loading.lottie"
      style={{ width: 350, height: 170 }}
      loop
      autoplay
    />
    </div>
  )
}

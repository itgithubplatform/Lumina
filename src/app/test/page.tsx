import { GoogleAi } from '@/lib/googleAi'
import React from 'react'

export default async function page() {
    const googleAi = GoogleAi.getInstance()
    // const text = await googleAi.generateText("Explain the theory of relativity in simple terms.");
    const text = await googleAi.generateTextToSpeech("Hello, this is a test of Google Text to Speech API. I hope you find this useful.", "public/output.mp3");
  return (
    <div>
        <h1 className='text-2xl font-bold'>Google AI Test</h1>
        <p className='mt-4'>{text}</p>      
    </div>
  )
}

import { GoogleAi } from '@/lib/googleAi'
import { HLSConverter } from '@/lib/HLSConvarter'
import React from 'react'

export default async function page() {
    const googleAi = GoogleAi.getInstance()
  //  const path = await googleAi.generateSpeechToText("gs://lumina-tech/audio/1759767484946-output.mp3")
  //  console.log(path);
  const hlsConvarter = HLSConverter.getInstance()
 const hlsPath = await hlsConvarter.extractAudio("public/1.mp4", "public/hls");
 console.log(hlsPath);   
  return (
    <div>
        <h1 className='text-2xl font-bold'>Google AI Test</h1>
        <p className='mt-4'></p>      
    </div>
  )
}

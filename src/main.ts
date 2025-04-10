import './style.css'

import { setupCounter } from './counter.ts'
import {keyToFreq} from './freq.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Typing</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const AudioContext = window.AudioContext 
const audioCtx = new AudioContext()

type note = [  OscillatorNode, GainNode ]
  
const activeNoteMap = new Map<string, note>()
let vibrato = false
let decay = 0.1
let attack = 0.1
let monophonic = true 

const handleKeydown = (e: KeyboardEvent)=>{
  if(e.repeat) return
  const freq = keyToFreq.get(e.key)
  if (!freq){
    switch(e.key){
      case "ArrowDown":
        for (const entry of activeNoteMap){
          entry[1][0].detune.linearRampToValueAtTime(200, audioCtx.currentTime+0.07)
        }
        break

      case "ArrowUp":
        for (const entry of activeNoteMap){
          entry[1][0].detune.linearRampToValueAtTime(100, audioCtx.currentTime+0.07)
        }
        break
    }
  }
  else{
    if(monophonic){
      for(const activeNote of activeNoteMap){
        const note = activeNote[1]
        rampNoteOff(note[0], note[1], decay)
      }
    }
    
    
    const currTime = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, currTime)
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    activeNoteMap.set(e.key, [osc, gain])

    gain.gain.setValueAtTime(0, currTime)
    gain.gain.linearRampToValueAtTime(1, currTime+attack)
    osc.start(currTime)
  }

}
const rampNoteOff = (osc: OscillatorNode, gain: GainNode, decay: number)=>{
    gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime+decay)
    osc.stop(audioCtx.currentTime+decay)
}

const handleKeyup = (e: KeyboardEvent)=>{
  const note = activeNoteMap.get(e.key)
  if(note){
    const osc = note[0]
    const gain = note[1]
    rampNoteOff(osc, gain, decay)
    activeNoteMap.delete(e.key)
  }else{
    switch(e.key){
      case "ArrowUp":
        for (const note of activeNoteMap){
          note[1][0].detune.linearRampToValueAtTime(0, audioCtx.currentTime+0.07)
        }
        break

      
      case "ArrowDown":
        for (const note of activeNoteMap){
          note[1][0].detune.linearRampToValueAtTime(0, audioCtx.currentTime+0.07)
        }
        break
    }
  }
}


document.addEventListener('keydown', handleKeydown)
document.addEventListener('keyup', handleKeyup)
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

const activeOsc = new Map<string, OscillatorNode>()


const handleKeydown = (e: KeyboardEvent)=>{
  if(e.repeat) return
  const freq = keyToFreq.get(e.key)
  if (!freq) return

  const currTime = audioCtx.currentTime
  const osc = audioCtx.createOscillator()
  activeOsc.set(e.key, osc)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, currTime)

  osc.connect(audioCtx.destination)
  osc.start(currTime)
}

const handleKeyup = (e: KeyboardEvent)=>{
  const osc = activeOsc.get(e.key)
  if(osc){
    osc.stop(audioCtx.currentTime)
  }
}


document.addEventListener('keydown', handleKeydown)
document.addEventListener('keyup', handleKeyup)
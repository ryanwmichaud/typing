import './style.css'

import {setupSlider} from './slider.ts'
import {keyToFreq} from   './freq.ts'
import { setupToggleButon } from './toggleButton.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>

      <select name="string-1-note">
      
      <label for="attack-slider"> Attack </label>
      <input id="attack-slider" 
        name="attack"
        type="range"
        value="0.5"
        min="0.01"
        max="0.50"
        step="0.01"/>
      <p id="attack-value"> </p>

      <label for="decay-slider"> Decay </label>
      <input id="decay-slider" 
        type="range"
        value="0.01"
        min="0.01"
        max="0.50"
        step="0.01"/>
      <p id="decay-value"> </p>

      <button id="monophonic-button" >Monophonic<button/>

    </div>
  </div>
`

const AudioContext = window.AudioContext 
const audioCtx = new AudioContext()

type note = [  OscillatorNode, GainNode ]
  
const activeNoteMap = new Map<string, note>()
let vibrato = false
let decay = 0.01
let attack = 0.01
let monophonic = true 

const handleKeydown = (e: KeyboardEvent)=>{
  console.log(e.key)
  if(e.repeat) {return}
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
      stopAll()
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
    //console.log(activeNoteMap)
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
const stopAll = ()=>{
  for(const activeNote of activeNoteMap){
    const note = activeNote[1]
    rampNoteOff(note[0], note[1], decay)
  }
  activeNoteMap.clear()

}


document.addEventListener('keydown', handleKeydown)
document.addEventListener('keyup', handleKeyup)
window.addEventListener('blur', stopAll)

const attackSlider = document.getElementById('attack-slider') as HTMLInputElement
const attackValue = document.getElementById('attack-value') as HTMLParagraphElement
const decaySlider = document.getElementById('decay-slider') as HTMLInputElement
const decayValue = document.getElementById('decay-value') as HTMLParagraphElement
const monophonicButton = document.getElementById('monophonic-button') as HTMLButtonElement
setupSlider(attackSlider, attackValue, (value)=>{attack = value})
setupSlider(decaySlider, decayValue, (value)=>{decay = value})
setupToggleButon(monophonicButton, true, (newState: boolean)=> {monophonic = newState})

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
//setupAttack(document.querySelector<HTMLInputElement>('#attack')!)
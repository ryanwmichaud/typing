import './style.css'

import {setupSlider} from './components/slider.ts'
import {keyToFreq, updateKeyToFreq, pitchedNote, defaultTuning} from   './freq.ts'
import { setupToggleButon } from './components/toggleButton.ts'
import { setUpNoteSelector } from './components/noteSelector.ts'

const html = /*html*/`
  <div>
      <p class='tuning-header'>Tuning</p>
      <div class="tuning" id="tuning-element">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      
      <div id='atack-element' class='slider-element'>
        <label for="attack-slider" class='slider-label'> Attack </label>
        <input id="attack-slider" class='slider'
          name="attack"
          type="range"
          value="0.01"
          min="0.01"
          max="0.50"
          step="0.01"/>
        <p id="attack-value" class='slider-value'> </p>
      </div>
      
      <div id='decay-element' class='slider-element'>
        <label for="decay-slider" class='slider-label'> Decay </label>
        <input id="decay-slider" class='slider' 
          type="range"
          value="0.01"
          min="0.01"
          max="0.50"
          step="0.01"/>
        <p id="decay-value" class='slider-value'> </p>
      </div>
      
      <button id="monophonic-button" >Monophonic</button>

    </div>
  </div>
`

 
document.querySelector<HTMLDivElement>('#app')!.innerHTML = html 

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
    osc.type = 'sawtooth'
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
const tuningElement = document.getElementById('tuning-element') as HTMLElement
Array.from(tuningElement.children).forEach((child, index) => {
  const htmlChild = child as HTMLElement
  setUpNoteSelector(htmlChild, index, defaultTuning[index] )
});
setupSlider(attackSlider, attackValue, (value: number)=>{attack = value})
setupSlider(decaySlider, decayValue, (value: number)=>{decay = value})
setupToggleButon(monophonicButton, true, (newState: boolean)=> {monophonic = newState})

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
//setupAttack(document.querySelector<HTMLInputElement>('#attack')!)




updateKeyToFreq(defaultTuning)
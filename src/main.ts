import './style.css'

import {setupSlider} from './components/slider.ts'
import {keyToFreq, updateKeyToFreq, updateKeyToFreqRow, defaultTuning, clearKeyRow, appendToKeyRow, keys} from   './freq.ts'
import { setupToggleButon } from './components/toggleButton.ts'
import { setUpNoteSelector } from './components/noteSelector.ts'
import { setupDropDown } from './components/dropDown.ts'

const html = /*html*/`
  <div>
    <input class='textbox' id='textbox-1'>
    <p class='textbox' id='textbox-2'>
    <div class='content'>
        <p class='tuning-header'>Tuning</p>
        <div class="tuning-element" id="tuning-element">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div class='waveform-element'>
          <label class='waveform-label'>Waveform</label>
          <select id='waveform-select'>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
            <option value="sawtooth">Sawtooth</option>
          </select>
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
        
        <button id="monophonic-button" class='synth-button'>Monophonic</button>

      </div>
    </div>
  </div>
`

 
document.querySelector<HTMLDivElement>('#app')!.innerHTML = html 

const AudioContext = window.AudioContext 
const audioCtx = new AudioContext()

type note = [  OscillatorNode, GainNode ]
  
const activeNoteMap = new Map<string, note>()
let decay = 0.01
let attack = 0.01
let monophonic = true 
let waveform: OscillatorType = 'sine'

let fretCount = 0
const textbox1 = document.getElementById('textbox-1') as HTMLInputElement
const textbox2 = document.getElementById('textbox-2') as HTMLParagraphElement

const rampNoteOn = (e: KeyboardEvent, freq: number, currTime:number)=>{
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = waveform
  osc.frequency.setValueAtTime(freq, currTime)
  osc.connect(gain)
  gain.connect(audioCtx.destination)

  activeNoteMap.set(e.key, [osc, gain])

  gain.gain.setValueAtTime(0, currTime)
  gain.gain.linearRampToValueAtTime(1, currTime+attack)
  osc.start(currTime)
}
const rampNoteOff = (osc: OscillatorNode, gain: GainNode, decay: number)=>{
    gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime+decay)
    osc.stop(audioCtx.currentTime+decay)
}
const stopAll = ()=>{
  for(const activeNote of activeNoteMap){
    const note = activeNote[1]
    rampNoteOff(note[0], note[1], decay)
  }
  activeNoteMap.clear()

}

const handleKeydown = (e: KeyboardEvent)=>{
  if(e.repeat) {return}

  if(calibrateMode>=0){
    appendToKeyRow(calibrateMode, e.key)
    console.log(keys)
    
    fretCount += 1
    updatePrompt()
    return
  }

  const freq = keyToFreq.get(e.key)
  if (freq){
    if(monophonic){
      stopAll()
    }

    const currTime = audioCtx.currentTime
    rampNoteOn(e, freq, currTime)

  }
  else{
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
window.addEventListener('blur', stopAll)




let calibrateMode: number= -1

const resetPropmt = ()=>{
  if(textbox1){textbox1.value=`Type to play`}
  else{console.error('textbox1 is null')}
  if(textbox2){textbox2.textContent=`Click calibration buttons to set keys for each string`}
  else{console.error('textbox2 is null')} 
}
const updatePrompt = ()=>{
  if(textbox1){textbox1.value=`Play string ${calibrateMode}, fret ${fretCount+1}`}
  else{console.error('textbox1 is null')}
  if(textbox2){textbox2.textContent=`turn off calibration or calibrate new row to save`}
  else{console.error('textbox2 is null')}
}

const finishRowCalibration = (index: number)=>{
  document.getElementById(`calibrate-button-${index}`)?.classList.replace('calibrate-on','calibrate-off')
  let noteSelect = document.getElementById(`note-select-${calibrateMode}`) as HTMLSelectElement
  let octaveSelect = document.getElementById(`octave-select-${calibrateMode}`) as HTMLSelectElement
  updateKeyToFreqRow(index, [noteSelect.value, Number(octaveSelect.value) ])
}

const handleCalibrateButton = (index: number)=>{
  
  if(calibrateMode === index){
    //finish active calibration and return to playing
    finishRowCalibration(calibrateMode)
    calibrateMode = -1
    resetPropmt()

  }else{
    //finish old calibration if on
    if(calibrateMode >= 0){
      finishRowCalibration(calibrateMode)
    }  
    //turn on new calibration
    clearKeyRow(index)
    document.getElementById(`calibrate-button-${index}`)?.classList.replace('calibrate-off','calibrate-on')
    calibrateMode = index
    fretCount = 0
    updatePrompt()
  }
  
}

//setup page
const attackSlider = document.getElementById('attack-slider') as HTMLInputElement
const attackValue = document.getElementById('attack-value') as HTMLParagraphElement
const decaySlider = document.getElementById('decay-slider') as HTMLInputElement
const decayValue = document.getElementById('decay-value') as HTMLParagraphElement
const monophonicButton = document.getElementById('monophonic-button') as HTMLButtonElement
const tuningElement = document.getElementById('tuning-element') as HTMLElement
const waveformSelect = document.getElementById('waveform-select') as HTMLSelectElement

Array.from(tuningElement.children).forEach((child, index) => {
  const htmlChild = child as HTMLElement
  setUpNoteSelector(htmlChild, index, defaultTuning[index], calibrateMode, handleCalibrateButton)
});
setupDropDown(waveformSelect, waveform, (value: OscillatorType)=> {waveform = value})
setupSlider(attackSlider, attackValue, (value: number)=>{attack = value})
setupSlider(decaySlider, decayValue, (value: number)=>{decay = value})
setupToggleButon(monophonicButton, true, (newState: boolean)=> {monophonic = newState})

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
//setupAttack(document.querySelector<HTMLInputElement>('#attack')!)


resetPropmt()


updateKeyToFreq(defaultTuning)
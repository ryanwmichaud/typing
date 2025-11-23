import './style.css'

//ramp on doesnt need currtime and can pass string instead of event. just use event to get string anyway
//ramp off doesnt need decay
//rampoff should do the activenotemap deactivation not keyup
import {keyToFreq, updateKeyToFreq, updateKeyToFreqRow, defaultTuning, clearKeyRow, appendToKeyRow, keys} from   './freq.ts'

import {setupSlider} from './ui/components/slider.ts'
import { setupToggleButon } from './ui/components/toggleButton.ts'
import { setUpNoteSelector } from './ui/components/noteSelector.ts'
import { setupDropDown } from './ui/components/dropDown.ts'
import { AudioEngine } from './audio/synth.ts'

//inject html into document being served
import {html} from './ui/html.ts'
document.querySelector<HTMLDivElement>('#app')!.innerHTML = html 

//create audio context and connect it
const audioEngine = new AudioEngine()


let fretCount = 0

const textbox1 = document.getElementById('textbox-1') as HTMLInputElement
const textbox2 = document.getElementById('textbox-2') as HTMLParagraphElement




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
    if(audioEngine.monophonic){
      audioEngine.stopAll()
    }
    audioEngine.rampNoteOn(e.key, freq)
  }else{
    if(e.key == "ArrowUp"){
      audioEngine.detuneAll(100)
    }
    if(e.key == "ArrowDown"){
      audioEngine.detuneAll(-100)
    } 
  }
  
}
const handleKeyup = (e: KeyboardEvent)=>{
  //handle case if not active in rampnoteoff
  if(e.key === "ArrowUp" || e.key === "ArrowDown"){
    audioEngine.detuneAll(0)
  }else{
    audioEngine.rampNoteOff(e.key)

  }
}

document.addEventListener('keydown', handleKeydown)
document.addEventListener('keyup', handleKeyup)
window.addEventListener('blur', audioEngine.stopAll)




let calibrateMode: number= -1

const resetPrompt = ()=>{
  if(textbox1){textbox1.value=`Type to play`}
  else{console.error('textbox1 is null')}
  if(textbox2){textbox2.textContent=`Click calibration buttons to set keys for each string.`}
  else{console.error('textbox2 is null')} 
}
const updatePrompt = ()=>{
  if(textbox1){textbox1.value=`Play String ${calibrateMode+1}, Fret ${fretCount+1}`}
  else{console.error('textbox1 is null')}
  if(textbox2){textbox2.textContent=`Turn off calibration or calibrate new row to save.`}
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
    resetPrompt()

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
  setUpNoteSelector(htmlChild, index, defaultTuning[index], handleCalibrateButton)
});
setupDropDown(waveformSelect, audioEngine.waveform, (value: OscillatorType)=> {audioEngine.waveform = value})
setupSlider(attackSlider, attackValue, (value: number)=>{audioEngine.attack = value})
setupSlider(decaySlider, decayValue, (value: number)=>{audioEngine.decay = value})
setupToggleButon(monophonicButton, true, (newState: boolean)=> {audioEngine.monophonic = newState})

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
//setupAttack(document.querySelector<HTMLInputElement>('#attack')!)


resetPrompt()


updateKeyToFreq(defaultTuning)
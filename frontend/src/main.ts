import './style.css'

//ramp on doesnt need currtime and can pass string instead of event. just use event to get string anyway
//ramp off doesnt need decay
//rampoff should do the activenotemap deactivation not keyup
import {keyToFreq, updateKeyToFreq, defaultTuning } from   './freq.ts'
import { AudioEngine } from './audio/synth.ts'
import { setupUI } from './ui/setupUI.ts'
import {html} from './ui/html.ts'
import { Calibration } from './input/calibration.ts'

//inject html into document being served
document.querySelector<HTMLDivElement>('#app')!.innerHTML = html 

//create audio context and connect it
const audioEngine = new AudioEngine()


const textbox1 = document.getElementById('textbox-1') as HTMLInputElement
const textbox2 = document.getElementById('textbox-2') as HTMLParagraphElement

//setup page
const resetPrompt = ()=>{
        if(textbox1){textbox1.value=`Type to play`}
        else{console.error('textbox1 is null')}
        if(textbox2){textbox2.textContent=`Click calibration buttons to set keys for each string.`}
        else{console.error('textbox2 is null')} 
    }
const updatePrompt = (stringIndex: number, fretIndex: number)=>{
        textbox1.value=`Play String ${stringIndex+1}, Fret ${fretIndex+1}`
        textbox2.textContent=`Turn off calibration or calibrate new row to save.`
    }

const calibration = new Calibration(updatePrompt, resetPrompt)

const handleKeydown = (e: KeyboardEvent)=>{
  if(e.repeat) {return}

  else if(calibration.getCalibrateMode()>=0){
    calibration.calibrationStep(e.key)    
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
window.addEventListener('blur', audioEngine.stopAll.bind(audioEngine))

setupUI(audioEngine, defaultTuning, calibration.handleCalibrateButton.bind(calibration))

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
//setupAttack(document.querySelector<HTMLInputElement>('#attack')!)


resetPrompt()
updateKeyToFreq(defaultTuning)
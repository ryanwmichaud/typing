import { AudioEngine } from "../audio/synth"
import { Calibration } from "./calibration"
import { keyToFreq } from "../freq"

export function setupKeyHandlers(audioEngine: AudioEngine, calibration: Calibration){


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
window.addEventListener('blur', audioEngine.stopAll)


}


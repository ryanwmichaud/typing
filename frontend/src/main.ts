import './style.css'
import {updateKeyToFreq, defaultTuning } from   './freq.ts'
import { AudioEngine } from './audio/synth.ts'
import { setupUI } from './ui/setupUI.ts'
import {html} from './ui/html.ts'
import { Calibration } from './input/calibration.ts'
import { setupKeyHandlers } from './input/keyboard.ts'
import { Auth } from './auth/auth.ts'

//inject html into document being served
document.querySelector<HTMLDivElement>('#app')!.innerHTML = html 

//create audio context and connect it
const audioEngine = new AudioEngine()
const auth = new Auth()

const textbox1 = document.getElementById('textbox-1') as HTMLInputElement
const textbox2 = document.getElementById('textbox-2') as HTMLParagraphElement
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

//create buttons drop downs etc + connect them to functions
setupUI(audioEngine, defaultTuning, calibration.handleCalibrateButton, auth)
setupKeyHandlers(audioEngine,calibration)

resetPrompt()
updateKeyToFreq(defaultTuning)
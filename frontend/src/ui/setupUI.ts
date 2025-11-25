import { setupSlider } from './components/slider.ts'
import { setupToggleButon } from './components/toggleButton.ts'
import { setUpNoteSelector } from './components/noteSelector.ts'
import { setupDropDown } from './components/dropDown.ts'
import { AudioEngine } from '../audio/synth.ts'
import { pitchedNote } from '../freq.ts'
import { Auth } from '../auth/auth.ts'
import { setupLoginButton } from './components/loginButton.ts'


export function setupUI(audioEngine: AudioEngine, defaultTuning: pitchedNote[] , handleCalibrateButton: (index:number)=>void, auth: Auth) : void {
    const attackSlider = document.getElementById('attack-slider') as HTMLInputElement
    const attackValue = document.getElementById('attack-value') as HTMLParagraphElement
    const decaySlider = document.getElementById('decay-slider') as HTMLInputElement
    const decayValue = document.getElementById('decay-value') as HTMLParagraphElement
    const monophonicButton = document.getElementById('monophonic-button') as HTMLButtonElement
    const tuningElement = document.getElementById('tuning-element') as HTMLElement
    const waveformSelect = document.getElementById('waveform-select') as HTMLSelectElement
    const loginButton = document.getElementById('login-button') as HTMLButtonElement
    Array.from(tuningElement.children).forEach((child, index) => {
    const htmlChild = child as HTMLElement
    setUpNoteSelector(htmlChild, index, defaultTuning[index], handleCalibrateButton)
    });
    setupDropDown(waveformSelect, audioEngine.waveform, (value: OscillatorType)=> {audioEngine.waveform = value})
    setupSlider(attackSlider, attackValue, (value: number)=>{audioEngine.attack = value})
    setupSlider(decaySlider, decayValue, (value: number)=>{audioEngine.decay = value})
    setupToggleButon(monophonicButton, true, (newState: boolean)=> {audioEngine.monophonic = newState})
    setupLoginButton(loginButton, auth)
    return 
}
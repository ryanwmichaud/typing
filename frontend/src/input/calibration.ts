
import { updateKeyToFreqRow, appendToKeyRow } from "../freq"
import { clearKeyRow } from "../freq"

export class Calibration{

    private calibrateMode: number = -1
    private fretCount = 0
    updatePrompt: (stringIndex: number, fretIndex:number)=>void
    resetPrompt: ()=>void

    constructor (updatePrompt: (stringIndex: number, fretIndex:number)=>void, resetPrompt: ()=>void){
        this.updatePrompt = updatePrompt
        this.resetPrompt = resetPrompt
    }

    getCalibrateMode = ()=>{
        return this.calibrateMode
    }
    finishRowCalibration = (index: number)=>{
        document.getElementById(`calibrate-button-${index}`)?.classList.replace('calibrate-on','calibrate-off')
        let noteSelect = document.getElementById(`note-select-${this.calibrateMode}`) as HTMLSelectElement
        let octaveSelect = document.getElementById(`octave-select-${this.calibrateMode}`) as HTMLSelectElement
        updateKeyToFreqRow(index, [noteSelect.value, Number(octaveSelect.value) ])
    }
    calibrationStep = (key: string)=>{
        appendToKeyRow(this.calibrateMode, key)    
        this.fretCount += 1
        this.updatePrompt(this.calibrateMode, this.fretCount)
    }
    handleCalibrateButton = (index: number)=>{
        if(this.calibrateMode === index){
            //finish active calibration and return to playing
            this.finishRowCalibration(this.calibrateMode)
            this.calibrateMode = -1
            this.resetPrompt()

        }else{
            //finish old calibration if on
            if(this.calibrateMode >= 0){
            this.finishRowCalibration(this.calibrateMode)
            }  
            //turn on new calibration
            clearKeyRow(index)
            document.getElementById(`calibrate-button-${index}`)?.classList.replace('calibrate-off','calibrate-on')
            this.calibrateMode = index
            this.fretCount = 0
            this.updatePrompt(this.calibrateMode, this.fretCount)
        }
    }
}
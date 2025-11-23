import { pitchedNote, updateKeyToFreqRow } from '../../freq.ts'

export function setUpNoteSelector(container: HTMLElement, index: number, defaultTuning: pitchedNote, setCalibrateMode: (value: number)=>void){

    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const octaves = ['1', '2', '3', '4', '5', '6', '7']

    function setupSelect(id: string, className: string, options: string[], defaultValue:string){

        container.className = 'pitched-note-selector'
        container.id = `string-${index}-selector`

        const selectElement = document.createElement('select')
        selectElement.id = id 
        selectElement.className = className 

        options.forEach((name)=>{
            const option = document.createElement('option')
            option.value = name
            option.textContent = name
            selectElement.appendChild(option)
        })
        selectElement.value = defaultValue
        selectElement.addEventListener('change', ()=>{
            const note = container.querySelector('.note-select') as HTMLSelectElement
            const octave = container.querySelector('.octave-select') as HTMLSelectElement
            updateKeyToFreqRow(index, [note.value, Number(octave.value)])
        })
        container.appendChild(selectElement)
    }

    setupSelect(`note-select-${index}`, 'note-select', noteNames, defaultTuning[0])
    setupSelect(`octave-select-${index}`, 'octave-select', octaves, String(defaultTuning[1]))

    const calibrateButton = document.createElement('button')
    calibrateButton.className = `calibrate-button`
    calibrateButton.classList.add('calibrate-off')
    calibrateButton.id = `calibrate-button-${index}`
    calibrateButton.textContent = "recalibrate keys"
    calibrateButton.addEventListener('click',()=>{setCalibrateMode(index)})
    container.appendChild(calibrateButton)



}

/*
<div>
<select name="string-1-octave">
  <option>A</option>
  <option>A#</option>
  <option>B</option>
  <option>C</option>
  <option>C#</option>
  <option>D</option>
  <option>D#</option>
  <option>E</option>
  <option>F</option>
  <option>F#</option>
  <option selected='true'>G </option>
  <option>G#</option>
</select>
<select name="string-1-octave">
  <option>1</option>
  <option>2</option>
  <option>3</option>
  <option>4</option>
  <option selected='true'>5 </option>
  <option>6</option>
  <option>7</option>
</select>
</div>
*/
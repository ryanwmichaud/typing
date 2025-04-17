import { updateKeyToFreqRow } from "./freq"



export function setUpNoteSelector(container: HTMLElement, index: number){

    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const octaves = ['1', '2', '3', '4', '5', '6', '7']

    function setupSelect(id: string, className: string, options: string[]){

        const selectElement = document.createElement('select')
        selectElement.id = id 
        selectElement.className = className 

        options.forEach((name)=>{
            const option = document.createElement('option')
            option.value = name
            option.textContent = name
            selectElement.appendChild(option)
        })

        selectElement.addEventListener('change', ()=>{
            const note = container.querySelector('.note-select') as HTMLSelectElement
            const octave = container.querySelector('.octave-select') as HTMLSelectElement
            updateKeyToFreqRow([note.value, Number(octave.value)], index)
        })
        container.appendChild(selectElement)
    }

    setupSelect(`note-select-${index}`, 'note-select', noteNames)
    setupSelect(`octave-select-${index}`, 'octave-select', octaves)



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
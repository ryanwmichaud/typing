
          
export const html = /*html*/`
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

export function setupSlider( slider: HTMLInputElement, display: HTMLElement, onChange: (value: number) => void){
  slider.addEventListener('input',()=>{
    const value = Number(slider.value)
    display.textContent = slider.value
    onChange(value)
  })

  //init
  onChange(Number(slider.value))
  display.textContent = slider.value
  
}

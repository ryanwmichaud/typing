export function setupDropDown(select: HTMLSelectElement, initValue: OscillatorType, onChange: (value: OscillatorType)=>void) {
    
    select.addEventListener('change', ()=>{
        const value = select.value as OscillatorType
        onChange(value)
    })

    //init
    onChange(initValue)

}
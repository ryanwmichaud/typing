
export function setupToggleButon(
    button: HTMLButtonElement, initValue: boolean, onToggle: (newState: boolean)=>void){

        let state = initValue //persists w closure. init once

        button.addEventListener('click', ()=>{
            state = !state
            onToggle(state) 

            if(state){
                button.classList.replace('toggled-off', 'toggled-on')
              }else{
                button.classList.replace('toggled-on', 'toggled-off')
            }

        })

    //init
    button.classList.add(state ? 'toggled-on': 'toggled-off')
}



import { Auth } from "../../auth/auth";


export function setupLoginButton(button: HTMLButtonElement, auth: Auth){

    button.addEventListener('onClick', ()=>{
        if (auth.isLoggedIn()) {
            auth.logout 
            button.textContent="Log In"
        }else {
            auth.login('test', 'test') 
            button.textContent="Log Out"
        }
        console.log(auth.isLoggedIn)
    })
}
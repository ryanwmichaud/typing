

export class Auth {
    private loggedIn = false

    login(username: string, password: string){
        this.loggedIn = true
    }

    logout() {
        this.loggedIn = false 
    }

    isLoggedIn(){
        return this.loggedIn
    }

}
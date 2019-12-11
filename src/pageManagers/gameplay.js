class Gameplay {
    
    constructor() {
        this.score = 0
        this.unicornSpeed = 2000
    }

    initBindingsAndEventListeners() {
        this.container = document.querySelector("#game-container")
    }


    randomHole() {
        let number = Math.floor(Math.random() * 9) + 1
        let hole = document.getElementById(`${number}`)
        return hole
    }

    renderScore() {
        document.querySelector("#game-container p").innerHTML = this.score
    }

    increaseSpeed() {
        this.unicornSpeed -= 400
        return this.unicornSpeed
    }

}
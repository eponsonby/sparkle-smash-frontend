class Gameplay {
    // maybe add difficulty level
    // game state - running, paused, completed. Once complete, post game to the database
    // decrease the unicorn speed, every tiem you get a hit, clear speed then 
    // set a new speed
    // this.currentInterval = setInterval
    
    constructor() {
        this.score = 0
        this.unicornSpeed = 3000
        this.state = 'running'
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

    renderState() {
        console.log(this.state)
    }
}
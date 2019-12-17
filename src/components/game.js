class Game {
    constructor(gameJSON) {
        this.userName = gameJSON.user.name
        this.score = parseInt(gameJSON.score)
    }

    get name() {
        return this.userName
    }

    score() {
        return this.score
    }
}
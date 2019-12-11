class Game {
    constructor(gameJSON) {
        this.userName = gameJSON.user.name
        this.score = gameJSON.score
    }

    get html() {
        return (`
        <p>${this.userName} -- ${this.score}</p>
        `)
    }
}
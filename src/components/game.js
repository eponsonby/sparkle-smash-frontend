class Game {
    constructor(gameJSON) {
        this.user_id = gameJSON.user_id
        this.score = gameJSON.score
    }

    get html() {
        return (`
        <p>${this.user_id} -- ${this.score}</p>
        `)
    }
}
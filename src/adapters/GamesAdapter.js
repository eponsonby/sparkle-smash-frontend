class GamesAdapter {
    constructor() {
        this.baseUrl = 'http://localhost:3000/games'
    }

    getGames() {
        return fetch(this.baseUrl).then(res => res.json()
        )
    }
}
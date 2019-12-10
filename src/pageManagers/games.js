class Games {
    constructor() {
        this.games = []
        this.adapter = new GamesAdapter()
        this.initBindingsAndEventListeners()
        this.fetchAndLoadGames()
    }

    initBindingsAndEventListeners() {

    }

    fetchAndLoadGames() {
        this.adapter.getGames().then(games => {
            games.forEach(game => this.games.push(new Game(game)))
            this.renderScores()
        })

    }


    renderScores() {
        document.querySelector("#app-container p").innerHTML = this.games.map(g => g.html).join("")
    }
}
class Games {
    constructor() {
        this.games = []
        this.unicornsArray = [] 
        this.gamesAdapter = new GamesAdapter()
        this.usersAdapter = new UsersAdapter()
        this.unicornsAdapter = new UnicornsAdapter()
        this.initBindingsAndEventListeners()
        this.fetchAndLoadUnicorns()
        this.fetchAndLoadGames()
        this.rendered = false
        this.currentHole
        this.currentInterval = null
        this.paused = false
        this.counter = 0
        this.score = 0
        this.unicornSpeed = 2000
   }

    initBindingsAndEventListeners() {
        this.startGameButton = document.querySelector("#begin-button")
        this.startGameButton.addEventListener('click', this.handleBeginGame.bind(this))
        this.endGameButton = document.querySelector("#end-button")
        this.endGameButton.addEventListener('click', this.handleEndGame.bind(this))
        this.container = document.querySelector("#unicorns-grid")
        this.container.addEventListener("click", this.handleSmash.bind(this))
        this.unicornHoles = document.querySelectorAll("#unicorn-holes")
    }

    fetchAndLoadGames() {
        this.gamesAdapter.getGames().then(games => {
            games.forEach(game => this.games.push(new Game(game)))
            this.renderScores()
        })

    }

    fetchAndLoadUnicorns() {
        this.unicornsAdapter.getUnicorns().then(unicorns => {
            unicorns.forEach(unicorn => this.unicornsArray.push(new Unicorn(unicorn)))
        })
    }

    renderScores() {
        document.querySelector("#app-container p").innerHTML = this.games.map(g => g.html).join("")
    }


    loopCorns() {
        this.currentInterval = setInterval(() => {
        this.counter += 1

            if(this.counter === 100) {
                this.handleEndGame()
            } else if (
                this.counter % 10 === 0 && this.unicornSpeed > 400) {
                this.increaseSpeed()
                clearInterval(this.currentInterval)
                this.loopCorns()
            } else {
                if(this.rendered) {
                    this.rendered = false
                    this.renderScore()
                    this.derenderUnicorn()
                } else {
                    this.rendered = true
                    this.renderScore()
                    this.renderUnicorn()
                }
            }
    }, this.unicornSpeed)

    }

    renderUnicorn() {
        let number = Math.floor(Math.random() * 6) + 0
        let unicorn = this.unicornsArray[number].image
        let randomHole = this.randomHole()
        let image = document.createElement("img")
        image.src = unicorn
        image.id = "unicorn"
        randomHole.appendChild(image)
        this.currentHole = randomHole
    }


    derenderUnicorn() {
        let hole = this.currentHole
        let unicornImage = hole.getElementsByTagName("img").namedItem("unicorn")
        unicornImage.parentNode.removeChild(unicornImage)
    }
    
    handleSmash(event) {
        if (event.target.id === "unicorn") {
            this.registerSmash()
            this.derenderUnicorn()
            this.rendered = false
        }
    }

    registerSmash() {
        this.score = this.score + 10
    }

    handleBeginGame() {
        this.loopCorns()
    }

    getUser() {
        let name = document.forms['new-user'].elements['text'].value
        console.log(name)
    }

    createUser() {
        try{
            await.this.usersAdapter.saveUsers({
                user: {
                    name: this.name
                }
            })
        } catch(err){
            alert( err.status )
        }
    }

    async handleEndGame() {
        clearInterval(this.currentInterval)
        this.derenderUnicorn()
        try{

            const jsonObj = await this.gamesAdapter.saveGame({
                game: {
                    user_id: 1,
                    score: this.score
                }
            })

        }catch(err){

            alert( err.status )

        }
        
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
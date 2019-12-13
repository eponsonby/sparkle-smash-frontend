class Games {
    constructor() {
        this.games = []
        this.unicornsArray = [] 
        this.usersArray = []
        this.currentUserId = 0
        this.gamesAdapter = new GamesAdapter()
        this.usersAdapter = new UsersAdapter()
        this.unicornsAdapter = new UnicornsAdapter()
        this.fetchAndLoadUnicorns()
        this.fetchAndLoadGames()
        this.initBindingsAndEventListeners()
        this.rendered = false
        this.currentHole
        this.currentInterval = null
        this.paused = false
        this.counter = 0
        this.score = 0
        this.unicornSpeed = 2000
        this.name = ''
        this.currentUserId = ''
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

    fetchAndLoadUsers() {
        this.usersAdapter.getUsers().then(users => {
            users.forEach(user => this.usersArray.push(new User(user)))
        })
    }

    renderScores() {
        document.querySelector("#app-container p").innerHTML = this.games.map(g => g.html).join("")
    }


    async loopCorns() {
        this.currentInterval = setInterval(() => {
        this.counter += 1

            if(this.counter === 100) {
                this.handleEndGame()
            } else if (
                this.counter % 10 === 0 && this.unicornSpeed > 350) {
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


    renderSplat() {
        let splat = document.createElement("img")
        splat.src = 'styles/splat!.png'
        splat.id = "splat"
        this.currentHole.appendChild(splat)
        setTimeout(this.derenderSplat, 1000)
    }

    derenderSplat() {
            let allSplats = document.querySelectorAll("#splat")
            allSplats.forEach(splat => splat.style.display = "none")
        }
    
    handleSmash(event) {
        if (event.target.id === "unicorn") {
            this.registerSmash()
            this.renderSplat()
            this.derenderUnicorn()
            this.rendered = false
        }
    }

    registerSmash() {
        this.score = this.score + 10
    }

    handleBeginGame() {
        this.createUser()
        this.loopCorns()
    }

    async createUser() {
        this.name = document.getElementById("user-name").value
        
        try{
            const userObj = await this.usersAdapter.saveUser({
                user: {
                    name: this.name
                }
            })
            this.currentUser = new User(userObj)
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
                    user_id: this.currentUser.id,
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
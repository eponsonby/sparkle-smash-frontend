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
        this.form
   }

    initBindingsAndEventListeners() {
        this.startGameButton = document.querySelector("#begin-button")
        this.startGameButton.addEventListener('click', this.handleBeginGame.bind(this))
        this.endGameButton = document.querySelector("#end-button")
        this.endGameButton.addEventListener('click', this.handleEndGame.bind(this))
        this.container = document.querySelector("#unicorns-grid")
        this.container.addEventListener("click", this.handleSmash.bind(this))
        this.unicornHoles = document.querySelectorAll("#unicorn-holes")
        // Prevent form submission upon hitting the enter key
        document.getElementById("new-user").onkeypress = function(e) {
            let key = e.charCode || e.keyCode || 0;
            if (key === 13) {
                e.preventDefault()
            }
        }
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

    sortGamesByScore( a, b ) {
        if ( a.score < b.score ){
          return -1;
        }
        if ( a.score > b.score ){
          return 1;
        }
        return 0;
      }


    renderScores() {
        let sortedGames = this.games.sort( this.sortGamesByScore ).slice(-20)
            sortedGames.forEach(game => {
            let table = document.querySelector("#score-table")
            let row = table.insertRow(0)
            let cell1 = row.insertCell(0)
            let cell2 = row.insertCell(1)
            cell1.innerHTML = game.name
            cell2.innerHTML = game.score
            })
        }


    async loopCorns() {
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
        console.log(image.src)
        if (image.src === "file:///Users/excellaep/Development/code/sparkle-smash/js-frontend/styles/sleepy-corn.png"){
            image.id = "sleepy-corn"
        } else {
            image.id = "unicorn"
        }
        randomHole.appendChild(image)
        this.currentHole = randomHole
    }


    derenderUnicorn() {
        let hole = this.currentHole
        let unicornImage = hole.getElementsByTagName("img").namedItem("unicorn") || hole.getElementsByTagName("img").namedItem("sleepy-corn")
        unicornImage.parentNode.removeChild(unicornImage)

    }


    renderSplat() {
        let splat = document.createElement("img")
        splat.src = 'styles/splat!.png'
        splat.id = "splat"
        this.currentHole.appendChild(splat)
        setTimeout(this.derenderSplat, 500)
    }

    derenderSplat() {
            let allSplats = document.querySelectorAll("#splat")
            allSplats.forEach(splat => splat.style.display = "none")
        }
    
    handleSmash(event) {
        if (event.target.id === "unicorn" || event.target.id === "sleepy-corn") {
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
        document.getElementById("welcome-screen").style.visibility = 'hidden'
        document.getElementsByTagName("body")[0].style.cursor = "url('styles/wand.png') 25 15, auto"
        this.loopCorns()
    }

    async createUser() {
        this.name = document.getElementById("user-name").value
        if this.name = ""
            console.log("Can't")
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
        this.derenderUnicorn()
        clearInterval(this.currentInterval)
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
        document.querySelector("#current-score p").innerHTML = this.score
    }

    increaseSpeed() {
        this.unicornSpeed -= 400
        return this.unicornSpeed
    }
}
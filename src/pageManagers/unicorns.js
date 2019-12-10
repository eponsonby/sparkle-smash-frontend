class Unicorns {
    constructor() {
        this.unicorns = []
        //this.adapter gets the baseUrl set in UnicornsAdapter
        this.adapter = new UnicornsAdapter()
        this.initBindingsAndEventListeners()
        this.fetchAndLoadUnicorns()
        this.rendered = false
        this.currentHole
        this.currentInterval = null
        this.paused = false
    }

    initBindingsAndEventListeners() {
        this.container = document.querySelector("#unicorns-grid")
        this.startGameButton = document.querySelector("#begin-button")
        this.startGameButton.addEventListener('click', this.handleBeginGame.bind(this))
        // this.pauseGameButton = document.querySelector("#pause-button")
        // this.pauseGameButton.addEventListener('click', this.handlePauseGame.bind(this))
        this.endGameButton = document.querySelector("#end-button")
        this.endGameButton.addEventListener('click', this.handleEndGame.bind(this))
        this.unicornHoles = document.querySelectorAll("#unicorn-holes")
        this.container.addEventListener("click", this.handleSmash.bind(this))
    }

    
    // Creates new instances of the Unicorn class using the unicorns fetched from the DB
    fetchAndLoadUnicorns() {
        this.adapter.getUnicorns().then(unicorns => {
            unicorns.forEach(unicorn => this.unicorns.push(new Unicorn(unicorn)))
        })
    }

    handleBeginGame() {
        this.gameplay = new Gameplay()
        this.currentInterval = setInterval(() => {
                if(this.rendered) {
                    this.rendered = false
                    this.gameplay.renderScore()
                    this.derenderUnicorn()
                } else {
                    this.rendered = true
                    this.gameplay.renderScore()
                    this.renderUnicorn()
                }
        }, 2000)
    }

    // handlePauseGame() {
    //     if(this.paused) {
    //         this.paused = false
    //         document.querySelector("#pause-button").innerHTML = "pause"
    //     } else {
    //         this.paused = true
    //         document.querySelector("#pause-button").innerHTML = "unpause"
    //     }
    // }

    handleEndGame() {
        this.derenderUnicorn()
        clearInterval(this.currentInterval)
    }

     renderUnicorn() {
            let number = Math.floor(Math.random() * 6) + 0
            let unicorn = this.unicorns[number].image
            let randomHole = this.gameplay.randomHole()
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
        this.gameplay.score = this.gameplay.score + 10
    }


}
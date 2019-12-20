class UnicornsAdapter {
    constructor() {
        this.baseUrl = 'https://sparkle-smash.herokuapp.com/unicorns'
    }

    getUnicorns() {
        return fetch(this.baseUrl).then(res => res.json()
        )
    }
}

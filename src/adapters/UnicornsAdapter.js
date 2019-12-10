class UnicornsAdapter {
    constructor() {
        this.baseUrl = 'http://localhost:3000/unicorns'
    }

    getUnicorns() {
        return fetch(this.baseUrl).then(res => res.json()
        )
    }
}

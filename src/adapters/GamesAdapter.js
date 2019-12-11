class GamesAdapter {
    constructor() {
        this.baseUrl = 'http://localhost:3000/games'
    }

    getGames() {
        return fetch(this.baseUrl).then(res => res.json()
        )
    }

    async saveGame(params) {
        const res = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(params)
        })
        if(res.status < 200 || res.status > 299){
            throw { status: res.status }
        }
        return await res.json()
        
    }
}
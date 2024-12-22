import { Player, sort } from "./player.js";

export class PlayerCard extends HTMLElement {

    constructor() {
        super()

        this.name = 'Nome'

        /**
         * Name of player.
         */
        const input = document.createElement('input')
        input.classList.add('name')
        input.type = 'text'
        input.value = this.name

        // When changing character, should update name attribute.
        input.addEventListener('change', () => {
            this.name = input.value
        })

        /**
         * Remove this card.
         */
        const remove = document.createElement('div')
        remove.classList.add('button remove')
        remove.textContent = 'X'

        this.append(input, remove)
    }

}

customElements.define("player-card", PlayerCard);

class Game {

    /**
     * @param {HTMLElement} body 
     */
    constructor(body) {

        this.body = body

    }
    
    /**
     * Clear the current page.
     */
    clear() {
        this.body.innerHTML = ''
    }

    /**
     * Create home screen.
     */
    home() {

        this.clear()

        const result = sort([
            new Player("Renan", 10),
            new Player("é", 25),
            new Player("muito", 5),
            new Player("gay", 9),
            new Player(", não", 1),
            new Player("é?", 40),
        ])


        const ranking = document.createElement('div');
        ranking.classList.add('ranking')

        const button = document.createElement('div');
        button.classList.add('start');
        button.textContent = 'Jogar';
        button.addEventListener('click' , () => this.players());
        
        const best = result[0].points;

        for (const [index, player] of result.entries())
            ranking.append(player.bar(best, index + 1))

        this.body.append(ranking)
        

    }

    // proxima tela
    players() {
        
        this.clear()
        /**
         * Add new player to list.
         */
        const add = document.createElement('div')
        add.classList.add('add')
        add.addEventListener('click', () => {

            new PlayerCard()

        })
        
    }

}

const body = document.querySelector('.content')
if (!(body instanceof HTMLElement)) {
    const message = "Não consegui renderizar o HTML."
    window.alert(message)
    throw Error(message)
}

const game = new Game(body);

game.home()
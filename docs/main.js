import { Player, sort } from "./player.js";

export class PlayerCard extends HTMLElement {

    constructor() {
        super()

        this.name = 'Nome'

        /**
         * Name of player.
         */
        const input = document.createElement('input')
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
        remove.classList.add('button', 'remove')
        remove.textContent = 'X'
        remove.addEventListener('click', () => this.remove())

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

        /**
         * Players of the current game.
         * @type {Array<Player>}
         */
        this.players = []

    }

    /**
     * @param {'home' | 'selection' | 'configuration' | 'prepare' | 'play' | 'results'} name
     */
    screen(name) {

        // Clear the current page.
        this.body.innerHTML = ''

        switch (name) {
            case 'home':
                this.screen_home()
                break;
            case 'selection':
                this.screen_selection()
                break;
            case 'prepare':
                this.screen_prepare()
                break;
        }

    }

    /**
     * Create home screen.
     * @private
     */
    screen_home() {

        const result = sort([
            new Player("Renan", 10),
            new Player("é", 25),
            new Player("muito", 5),
            new Player("gay", 9),
            new Player(", não", 1),
            new Player("é?", 40),
        ])

        /**
         * Ranking section.
         */
        const ranking = document.createElement('div');
        ranking.classList.add('ranking')
        
        const best = result[0].points;

        for (const [index, player] of result.entries())
            ranking.append(player.ranking(best, index + 1))

        /**
         * Start the game.
         */
        const start = document.createElement('div');
        start.classList.add('start');
        start.textContent = 'Jogar';
        start.addEventListener('click' , () => this.screen('selection'));

        this.body.append(start, ranking)
        
    }

    /**
     * Selection for players.
     * @private
     */
    screen_selection() {

        const container = document.createElement('div')
        container.classList.add('players', 'cards')

        const default_number_of_players = 14;
        for (let i = 1; i <= default_number_of_players; ++i)
            container.append(new PlayerCard())


        /**
         * Add new player to list.
         */
        const add = document.createElement('div')
        const container_add = document.createElement('div')
        add.classList.add('add', 'center')
        add.addEventListener('click', () => container_add.insertAdjacentElement('beforebegin', new PlayerCard()))
        add.textContent = '+'

        container_add.classList.add('container')
        container_add.append(add)
        container.append(container_add)

        /**
         * Button to continue.
         */
        const button = document.createElement('div');
        button.classList.add('button', 'continue')
        button.textContent = 'Seguir!'
        button.addEventListener('click', () => {

            const player_cards = /** @type {NodeListOf<PlayerCard>} */ (container.querySelectorAll('player-card'))

            for (const player_card of player_cards)
                this.players.push(new Player(player_card.name, 0))

            return this.screen('prepare')
        })


        this.body.append(container, button)
    }

    /**
     * Prepare the next player to play their turn.
     */
    screen_prepare() {

        console.log(this.players)

    }

}

const body = document.querySelector('.content')
if (!(body instanceof HTMLElement)) {
    const message = "Não conseguiu renderizar o HTML."
    window.alert(message)
    throw Error(message)
}

const game = new Game(body);

// game.screen('home')
game.screen('selection')
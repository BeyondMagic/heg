import { Player, sort } from "./player.js";
import { Module } from "./module.js";

import { Numbers } from "./modules/numbers.js";
import { Japanese } from "./modules/japanese.js";

/**
 * Modules, access them with their name.
 * @type {Map<string, Module>}
 */
const modules = new Map()
for (const module of [ Numbers, Japanese ]) {
    modules.set(module.name, module)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export class Round extends HTMLElement {

    /**
     * @param {Module} module
     */
    constructor(module = Numbers) {
        super()

        this.classList.add('round')

        /**
         * Module of this round.
         */
        this.module = module
        
        /**
         * Select type of module.
         */
        this.name = document.createElement('select')
        this.name.classList.add('deck')
        this.name.value = module.name

        for (const [name, _] of modules){
            const option = document.createElement('option')
            option.value = name
            option.text = name
            this.name.append(option)
        }

        this.name.addEventListener('change', () => {
            const module = modules.get(this.name.value)
            if (!module)
                throw Error("Changed to a module that does not exist.")
            this.module = module
            this.render_types()
        })

        /**
         * Select difficulty of round.
         */
        this.type = document.createElement('select')
        this.type.classList.add('type')
        this.type.value = module.types[0]

        for (const type of module.types)
        {
            const option = document.createElement('option')
            option.value = type
            option.text = type
            this.type.append(option)
        }

        /**
         * Select how many this rounds should repeat.
         */
        this.rounds = document.createElement('input')
        this.rounds.classList.add('quantity')
        this.rounds.value = '1'
        this.rounds.type = 'number'
        this.rounds.min = '1'

        /**
         * Set timer for each round.
         */
        this.timer = document.createElement('input')
        this.timer.classList.add('timer')
        this.timer.value = '30'
        this.timer.type = 'number'
        this.timer.min = '1'

        /**
         * Remove this card.
         */
        const remove = document.createElement('div')
        remove.classList.add('button', 'remove')
        remove.textContent = 'X'
        remove.addEventListener('click', () => this.remove())

        this.append(this.name, this.type, this.rounds, this.timer, remove)
    }

    /**
     * @private
     */
    render_types() {
        this.type.value = this.module.types[0]
        this.type.innerHTML = ''
        
        for (const type of this.module.types)
        {
            const option = document.createElement('option')
            option.value = type
            option.text = type
            this.type.append(option)
        }
    }

}

customElements.define("game-round", Round);

export class PlayerCard extends HTMLElement {

    /**
     * @param {string} name
     */
    constructor(name = "Nome") {
        super()

        /**
         * Name of player.
         */
        this.name = name
        
        /**
         * Input for player to put their name.
         */
        this.input = document.createElement('input')
        this.input.type = 'text'
        this.input.value = this.name

        // When changing character, should update name attribute.
        this.input.addEventListener('change', () => {
            this.name = this.input.value
        })

        /**
         * Remove this card.
         */
        const remove = document.createElement('div')
        remove.classList.add('button', 'remove')
        remove.textContent = 'X'
        remove.addEventListener('click', () => this.remove())

        this.append(this.input, remove)
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
        this.players = [
            new Player("Renan", 10)
        ]

        const card = new PlayerCard();
        card.name = "Renan"
        /**
         * @type {Array<PlayerCard>} Cards of the current game.
         */
        this.player_cards = [
            card
        ]

        /**
         * Rounds defined in the configuration page.
         * @type {Array<{deck: Module, time: number, difficulty: string}>}
         */
        this.rounds = []

    }

    /**
     * @param {'home' | 'selection' | 'config' | 'prepare' | 'play' | 'results'} name
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
            case 'config':
                this.screen_config()
                break;
            case 'prepare':
                this.screen_prepare()
                break;
            case 'play':
                this.screen_play()
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

        // Old session: players cards already have been set once or more.
        if (this.player_cards.length)
        {
            for (const player of this.player_cards)
                container.append(player)
            
        // New session: no players have played before.
        } else {
            const default_number_of_players = 14;
            for (let i = 1; i <= default_number_of_players; ++i)
                container.append(new PlayerCard())
        }

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

            // Saving the cards in case we go back to this page.
            this.player_cards = Array.from(player_cards)    

            this.screen('config')
        })

        this.body.append(container, button)
    }

    /**
     * Configurate the game.
     */
    screen_config() {

        /**
         * Add players in minimized form.
         */
        const cards = document.createElement('div')
        cards.classList.add('players', 'cards', 'minimum')
        for (const card of this.player_cards)
            cards.append(card)

        const hover = document.createElement('div')
        hover.classList.add('hover')
        cards.append(hover)
        
        hover.addEventListener('click', () => this.screen('selection'))

        /**
         * Rounds to configure.
         **/
    const rounds = document.createElement('div')
        
        rounds.classList.add('rounds')

        const labels = {
            container: document.createElement('div'),
            deck: document.createElement('div'),
            type: document.createElement('div'),
            quantity: document.createElement('div'),
            timer: document.createElement('div'),
            remove: document.createElement('div')
        }

        labels.deck.textContent = 'deck'
        labels.type.textContent = 'type'
        labels.quantity.textContent = 'quantity'
        labels.timer.textContent = 'timer'
        labels.remove.textContent = 'remove'

        labels.container.classList.add('round')
        labels.deck.classList.add('deck')
        labels.type.classList.add('type')
        labels.quantity.classList.add('quantity')
        labels.timer.classList.add('timer')
        labels.remove.classList.add('remove')

        labels.container.append(
            labels.deck,
            labels.type,
            labels.quantity,
            labels.timer,
            labels.remove
        )
        
        rounds.append(labels.container)

        for (let i = 1; i <= 2; ++i)
            rounds.append(new Round())

        /**
         * Button to add more rounds.
         */
        const add = document.createElement('div')
        add.classList.add('button', 'add', 'square')
        add.textContent = '+'

        /**
         * Button to continue.
         */
        const button = document.createElement('div');
        button.classList.add('button', 'continue')
        button.textContent = 'Começar!'
        button.addEventListener('click', () => this.screen('prepare'))

        this.body.append(cards, rounds, add, button)

    }

    /**
     * Prepare the next player to play their turn.
     */
    screen_prepare() {

        /**
         * Next player to play is the first one in the list.
         */
        const player = this.players[0]

        const startButton = document.createElement('div')
        const instructions = document.createElement('div')
        const playerTurn = document.createElement('div')

        playerTurn.classList.add('player-turn')
        playerTurn.textContent = `Vez de ${player.name} jogar!`
        
        instructions.textContent = 'Prepare-se para jogar!\nClique em Começar quando estiver pronto!'
        instructions.classList.add('instructions')

        startButton.classList.add('start', 'prepare-button')
        startButton.textContent = 'Pronto!'

        startButton.addEventListener('click', () => {
            instructions.remove()
            startButton.remove()

            let timer = 3;
            const countdown = document.createElement('h2')
            countdown.classList.add('timer')
            countdown.textContent = `${timer}`;
            this.body.append(countdown)

            const interval = window.setInterval(async () => {
                timer -= 1;

                if(timer > 0)
                    countdown.textContent = timer.toString();

                // When timer is over.
                else if (timer === 0) {
                    countdown.textContent = 'Vai!'
                }
                
                // Two seconds of transition into game;
                else if (timer < -2) {
                    window.clearInterval(interval)
                    // await sleep(2000)
                    this.screen('play')
                }            
            }, 1000)
        })

        this.body.append(playerTurn, instructions, startButton)
    }
    
    screen_play() {
        const player = this.players[0]
        
        // this.rounds = vai ser as rodadas definidas no começo do jogo
        // a próxima rodada é sempre a primeira
        // a gente dele a primeira depois de acabar a rodada
        // const gameDifficulty = this.rounds[0].difficulty;
        const gameDifficulty = "tutorial";
        let seconds = 120;

        // title element
        const playerTurn = document.createElement('div')
        playerTurn.classList.add('player-turn')
        playerTurn.textContent = `Turno de: ${player.name}`

        // cards element
        const cardsContainer = document.createElement('div')
        cardsContainer.classList.add('cards-container')

        // generate used numbers
        const shuffledCards = Numbers.render(gameDifficulty)
        const correctOrder = shuffledCards.slice().sort((a, b) => (Number.parseInt(a) - Number.parseInt(b)))

        console.log("before:", shuffledCards)
        console.log("correct:", correctOrder)
        shuffledCards.sort(() => Math.random() - 0.5)
        let currentOrder = shuffledCards.slice()
        console.log("after:", currentOrder)
        
        // timer
        const timer = document.createElement('div')
        timer.classList.add('timer', 'turn')
        timer.textContent = `Tempo restante: ${seconds}`
        
        //progress bar
        const progressBarContainer = document.createElement('div')
        progressBarContainer.classList.add('progress-bar-container')
        const progressBar = document.createElement('div')
        progressBar.classList.add('progress-bar')
        progressBar.style.width = '0%'
        progressBarContainer.appendChild(progressBar)

        const startTimer = () => {
            const interval = setInterval(() => {
                seconds--;
                if(seconds === 0) {
                    clearInterval(interval)
                    alert('Acabou o tempo! Você perdeu!')
                  
                    // endGame()
                } else {
                    timer.textContent = `Tempo restante: ${seconds}`
                }
            }, 1000)
        }
        
        const updateProgressBar = () => {
            const correcPositions =  currentOrder.reduce((acc, val, idx) => 
                (val === correctOrder[idx] ? acc + 1 : acc), 0
            )
            const progress = Math.round((correcPositions / currentOrder.length) * 100)
            progressBar.style.width = `${progress}%`
        }

        let firstCardSelected = null;
        const swaps = [];
        let isSwapping = false;
        
        const handleCardClick = (card) => {
            if(isSwapping) return;

            if(firstCardSelected === null) {
                firstCardSelected = card;
                card.classList.add('selected');
            }
            else if(card === firstCardSelected) {
                firstCardSelected.classList.remove('selected');
                firstCardSelected = null;
            }
            else {
                const secondCardSelected = card;

                swaps.push( {
                    first: {index: firstCardSelected.dataset.index, value: firstCardSelected.textContent},
                    second: {index: secondCardSelected.dataset.index, value: secondCardSelected.textContent},
                })

                isSwapping = true;
                firstCardSelected.classList.add('swapping');
                secondCardSelected.classList.add('swapping');   

                setTimeout(async () => {
                    const temp = firstCardSelected.textContent;
                    firstCardSelected.textContent = secondCardSelected.textContent;
                    secondCardSelected.textContent = temp;

                    firstCardSelected.classList.remove('selected', 'swapping');
                    secondCardSelected.classList.remove('selected', 'swapping');
                    
                    const firstIndex = parseInt(firstCardSelected.dataset.index);
                    const secondIndex = parseInt(secondCardSelected.dataset.index);
                    [currentOrder[firstIndex], currentOrder[secondIndex]] = [
                        currentOrder[secondIndex],
                        currentOrder[firstIndex],
                    ];

                    firstCardSelected = null;
                    isSwapping = false;

                    updateProgressBar();

                    if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
                        await sleep(1500) 
                        alert("Parabéns! Você venceu!");
                        this.screen("prepare");
                    }
                }, 500);

                
            }
        }

        shuffledCards.forEach((value,index) => {
            const card = document.createElement('div')
            card.classList.add('card')
            card.textContent = value.toString()
            card.dataset.index = index.toString()
            card.addEventListener('click', () => handleCardClick(card))
            cardsContainer.appendChild(card)
        });

        console.log("Swaps:", swaps)

        this.body.append(playerTurn, cardsContainer, timer, progressBarContainer)
        
        startTimer()
        updateProgressBar()
    }
}

const body = document.querySelector('.content')
const body2 = document.querySelector('.content.play')
if (!(body instanceof HTMLElement) || !(body2 instanceof HTMLElement)) {
    const message = "Não conseguiu renderizar o HTML."
    window.alert(message)
    throw Error(message)
}

const game = new Game(body);

// game.screen('home')
// game.screen('selection')
game.screen('config')
// game.screen('prepare')


const game2 = new Game(body2)

game2.screen('play')
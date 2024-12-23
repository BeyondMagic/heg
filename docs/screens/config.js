/**
 * @typedef {import('../game.js').Game} Game
 */

import { Round } from '../round.js'
const defaults = {
    name: "Números",
    type: "tutorial",
    quantity: 1,
    timer: 30,
    rounds: 2,
}

/**
 * Configurate the game.
 * @param {Game} game
 */
export function config(game) {
    /**
     * Add players in minimized form.
     */
    const cards = document.createElement('div')
    cards.classList.add('players', 'cards', 'minimum')
    for (const card of game.player_cards)
        cards.append(card)
    const hover = document.createElement('div')
    hover.classList.add('hover')
    cards.append(hover)
    
    hover.addEventListener('click', () => game.screen('selection'))
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
    labels.deck.textContent = 'Baralho'
    labels.type.textContent = 'Tipo'
    labels.quantity.textContent = 'Quantidade'
    labels.timer.textContent = 'Tempo'
    labels.remove.textContent = 'Remover'

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

    // Render previous saved rounds.
    if (game.rounds.length)
    {
        for (const round of game.rounds)
            rounds.append(round)

    // Render default rounds.
    } else {
        for (let i = 1; i <= defaults.rounds; ++i)
            {
                const round = new Round(
                    defaults.name,
                    defaults.type,
                    defaults.quantity,
                    defaults.timer
                )
        
                game.rounds.push(round)
                rounds.append(round)
            }
    }

    for (const round of game.rounds)
        round.name.value = round.pre_name
        
    /**
     * Button to add more rounds.
     */
    const add = document.createElement('div')
    add.classList.add('button', 'add', 'square')
    add.textContent = '+'
    add.addEventListener('click', () => {
        const round = new Round(
            defaults.name,
            defaults.type,
            defaults.quantity,
            defaults.timer
        )

        game.rounds.push(round)
        rounds.append(round)
    })
    /**
     * Button to continue.
     */
    const button = document.createElement('div');
    button.classList.add('button', 'continue')
    button.textContent = 'Começar!'
    button.addEventListener('click', () => {
        game.screen('prepare')

        const data = game.rounds.map(round => {
            return {
                name: round.name.value,
                type: round.type.value,
                quantity: round.rounds.value,
                timer: round.timer.value,
            }
        })

        localStorage.setItem('last_rounds', JSON.stringify(data))
    })
    game.body.append(cards, rounds, add, button)
}
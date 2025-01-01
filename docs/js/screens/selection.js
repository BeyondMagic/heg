/**
 * @typedef {import('../game.js').Game} Game
 */

const default_number_of_players = 4;

import { Player } from "../player.js";
import { PlayerCard } from "../player_card.js";

/**
 * Selection for players.
 * @param {Game} game
 */
export function selection(game) {
    
    const cards = document.createElement('div')
    cards.classList.add('players', 'cards')

    if (game.player_cards.length)
    {
        for (const player of game.player_cards)
            cards.append(player)
        
    // New session: no players have played before.
    } else {
        
        for (let i = 1; i <= default_number_of_players; ++i)
            cards.append(new PlayerCard())
    }
    /**
     * Add new player to list.
     */
    const add = document.createElement('div')
    const container_add = document.createElement('div')
    add.classList.add('add', 'center')
    add.addEventListener('click', () => 
        container_add.insertAdjacentElement('beforebegin', new PlayerCard()))
    add.textContent = '+'
    container_add.classList.add('container')
    container_add.append(add)
    cards.append(container_add)

    
    /**
     * Button to continue.
     */
    const button = document.createElement('div');
    button.classList.add('button', 'continue')
    button.textContent = 'Seguir!'
    button.addEventListener('click', () => {
        const player_cards = /** @type {NodeListOf<PlayerCard>} */ (cards.querySelectorAll('player-card'))
        for (const player_card of player_cards)
            game.players.push(new Player(player_card.name, 0))
        
        game.player_cards = Array.from(player_cards)

        const data = game.player_cards.map(player => player.name)
        localStorage.setItem('last_cards', JSON.stringify(data))

        game.screen('config')
    })

    game.body.append(cards, button)
}
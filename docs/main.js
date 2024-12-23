import { Player } from "./player.js"
import { PlayerCard } from "./player_card.js"
import { Round } from "./round.js"
import { Game } from "./game.js"

const body = document.querySelector('.content')
if (!(body instanceof HTMLElement)) {
    const message = "Não conseguiu renderizar o HTML."
    window.alert(message)
    throw Error(message)
}

/**
 * Read from LocalStorage a field and return it as a JSON object.
 * @param {string} field 
 * @returns {Array}
 */
function read (field) {
    const data = localStorage.getItem(field)
    if (!data) {
        localStorage.setItem(field, JSON.stringify([]))
        return []
    }
    return JSON.parse(data)
}

/**
 * Information of localStorage, data not parsed.
 */
const info = {
    players: /** @type {Array<{name: string, points: number}>} */ (read('players')),
    cards: /** @type {Array<string>} */ (read('last_cards')),
    rounds: /** @type {Array<{name: string, type: string, quantity: number, timer: number}>} */ (read('last_rounds'))
}

/**
 * @type {{
 *   players: Array<Player>,
 *   cards: Array<PlayerCard>,
 *   rounds: Array<Round>
 * }}
 */
const data = {
    players: [],
    cards: [],
    rounds: []
}

for (const player of info.players)
    data.players.push(new Player(player.name, player.points))

for (const name of info.cards)
    data.cards.push(new PlayerCard(name))
    
for (const round of info.rounds)
    data.rounds.push(new Round(round.name, round.type, round.quantity, round.timer))

const game = new Game(
    body,
    data.players,
    data.cards,
    data.rounds
);

game.screen('home')
// game.screen('selection')
// game.screen('config')
// game.screen('prepare')
// game.screen('play')
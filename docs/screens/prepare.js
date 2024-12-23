/**
 * @typedef {import('../game.js').Game} Game
 */

import { sleep } from '../utils.js';

const seconds_to_start = 3;
const delay_after_timer = 1000;

/**
 * Prepare the next player to play their turn.
 * @param {Game} game
 */
export function prepare(game) {

    /**
     * Next player to play is the first one in the list.
     */
    const player = game.players[0]
    
    const turn = document.createElement('div')
    turn.classList.add('player-turn')
    turn.textContent = `Vez de ${player.name} jogar!`
    
    const instructions = document.createElement('div')
    instructions.textContent = 'Prepare-se para jogar!\nClique em Começar quando estiver pronto!'
    instructions.classList.add('instructions')

    const start = document.createElement('div')
    start.classList.add('start', 'prepare-button')
    start.textContent = 'Pronto!'

    const countdown = document.createElement('h2')
    countdown.classList.add('timer')
    game.body.append(countdown)

    start.addEventListener('click', async () => {
        start.remove()
        instructions.remove()
    
        let timer = seconds_to_start;
        while (timer)
        {
            countdown.textContent = `${timer} segundos!`;
            --timer;
        }

        countdown.textContent = 'Vai!'

        await sleep(delay_after_timer);

        game.screen('play')
    })
    
    game.body.append(turn, instructions, start)
}
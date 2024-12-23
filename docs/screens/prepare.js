/**
 * @typedef {import('../game.js').Game} Game
 * @typedef {import('../player.js').Player} Player
 */

import { sleep } from '../utils.js';

const seconds_to_start = 3;
const delay_after_timer = 1000;

/**
 * Prepare the next player to play their turn.
 * @param {Game} game
 * @param {Player} player Player to prepare.
 * @returns {Promise<void>}
 */
export async function prepare(game, player) {
    
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

    game.body.append(turn, instructions, start)

    return new Promise(resolve => {
        start.addEventListener('click', async () => {

            start.remove()
            instructions.remove()
        
            let timer = seconds_to_start;
            while (timer)
            {
                countdown.textContent = `${timer} segundos!`;
                --timer;
                await sleep(1000);
            }

            countdown.textContent = 'Vai!'

            await sleep(delay_after_timer);

            resolve();
        })
    })
}
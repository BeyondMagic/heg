/**
 * @typedef {import('../game.js').Game} Game
 * @typedef {import('../player.js').Result} Result
 */

import { Player, sort } from '../player.js';

/**
 * Create ranking section.
 * @param {Array<Player> | Array<Result>} entries 
 * @param {number} n Show the best n player.
 * @returns {HTMLElement}
 */
export function ranking(entries, n = entries.length)
{
    const container = document.createElement('div');
    container.classList.add('ranking')

    const results = sort(entries).slice(0, n)

    console.log(results)

    const best = results[0].points;
    for (const [index, entry] of results.entries())
    {
        if (entry instanceof Player) {
            container.append(entry.ranking(best, index + 1))
        } else {
            const player = new Player(entry.name, entry.points)
            container.append(player.ranking(best, index + 1))
        }
    }       

    return container
}

/**
 * Show results in screen.
 * @param {Game} game
 */
export function results(game, type)
{
    /**
     * @type {Array<Result>}
     */
    for (const player of game.players)
        for (const result of player.results)
            game.ranking.push(result)

    localStorage.setItem('players', JSON.stringify(game.ranking))

    game.body.append(ranking(game.players))

    console.log("Show ranking of all players, and who got a position up or lost.")

    const button = document.createElement('div');
    button.classList.add('button', 'wide', 'end');
    button.textContent = 'Finalizar!'
    button.addEventListener('click', () => game.screen('home'))

    game.body.append(button)
}
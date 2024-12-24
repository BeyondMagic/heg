/**
 * @typedef {import('../game.js').Game} Game
 */

import { sort } from '../player.js';

/**
 * Show results in screen.
 * @param {Game} game
 * @param {'between' | 'end'} type 
 */
export function results(game, type) {

    // Use `game.players` to show all players.
    
    /**
     * Ranking section.
     */
    const ranking = document.createElement('div');
    ranking.classList.add('ranking')

    const best_players = sort(game.players)

    let best = best_players[0].points;
    for (const [index, player] of best_players.entries())
        ranking.append(player.ranking(best, index + 1))

    switch (type) {
        case 'between':
            console.log("Show ranking of all players, and who got a position up or lost.")
            break;
        case 'end':
            console.log("Show ranking of game and top three winners")
            break;
    }

    game.body.append(ranking)
}
import { Player, sort } from "../player.js";

/**
 * @typedef {import('../game.js').Game} Game
 */

/**
 * Best N players to show in home screen.
 */
const n_best_players = 10

/**
 * Create home screen.
 * @param {Game} game
 */
export function home (game, players) {

    const result = sort(players).slice(0, n_best_players)

    /**
     * Start the game.
     */
    const start = document.createElement('div');
    start.classList.add('start');
    start.textContent = 'Jogar';
    start.addEventListener('click' , () => game.screen('selection'));
    game.body.append(start)

    // Only add ranking if there are previous players.
    if (!result.length)
        return
    
    /**
     * Ranking section.
     */
    const ranking = document.createElement('div');
    ranking.classList.add('ranking')

    const best = result[0].points;
    for (const [index, player] of result.entries())
        ranking.append(player.ranking(best, index + 1))

    game.body.append(ranking)
}
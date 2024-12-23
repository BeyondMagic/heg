/**
 * @typedef {import('../game.js').Game} Game
 */

/**
 * Show results in screen.
 * @param {Game} game
 * @param {'between' | 'end'} type 
 */
export function results(game, type) {

    // Use `game.players` to show all players.

    switch (type) {
        case 'between':
            console.log("Show ranking of all players, and who got a position up or lost.")
            break;
        case 'end':
            console.log("Show ranking of game and top three winners")
            break;
    }
}
/**
 * @typedef {{
 *  name: string,
 *  module: string,
 *  type: string,
 *  time: number,
 *  took: number,
 *  points: number,
 * }} Result
 */

import { Ranking } from "./ranking.js"

export class Player {
    /**
     * @param {string} name
     * @param {number} points
     */
    constructor(name, points) {
        this.name = name
        this.points = points
        this.swaps = 0

        /**
         * Results of each turn for player.
         * @type {Array<Result>}
         */
        this.results = []
    }

    /**
     * @param {number} best Best pontuation from actual game.
     * @param {number} position Position of player in the ranking.
     * @returns 
     */
    ranking(best, position) {
        return new Ranking(
            this.name,
            this.points,
            Math.round(this.points / best * 100),
            position
        )
    }
}

/**
 * @param {Player | Result} a 
 * @param {Player | Result} b 
 * @returns {number}
 */
function compare(a, b) {
    return b.points - a.points
}

/**
 * Returns sorted list of players.
 * @param {Array<Player | Result>} players 
 * @return {Array<Player | Result>}
 */
export function sort (players) {
    return players.sort(compare)
}
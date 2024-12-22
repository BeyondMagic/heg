import { Bar } from "./ranking.js"

export class Player {
    /**
     * @param {string} name 
     * @param {number} points 
     */
    constructor(name, points) {
        this.name = name
        this.points = points
    }

    /**
     * @param {number} best Best pontuation from actual game.
     * @returns 
     */
    bar(best) {
        return new Bar(this.name, Math.round(this.points / best * 100))
    }
}

/**
 * @param {Player} a 
 * @param {Player} b 
 * @returns {number}
 */
function compare(a, b) {
    return b.points - a.points
}

/**
 * Returns sorted list of players.
 * @param {Array<Player>} players 
 * @return {Array<Player>}
 */
export function sort (players) {
    return players.sort(compare)
}
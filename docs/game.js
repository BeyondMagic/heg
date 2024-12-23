// Transformar em imports de tipo apeans depois.

/**
 * @typedef {import('./player_card.js').PlayerCard} PlayerCard
 * @typedef {import('./player.js').Player} Player
 * @typedef {import('./round.js').Round} Round
 */

import { home } from "./screens/home.js"
import { selection } from "./screens/selection.js"
import { config } from "./screens/config.js"
import { play } from "./screens/play.js"

export class Game {

    /**
     * @param {HTMLElement} body
     * @param {Array<Player>} [ranking_players=[]]
     * @param {Array<PlayerCard>} [player_cards=[]]
     * @param {Array<Round>} [rounds=[]] 
     */
    constructor(body, ranking_players= [], player_cards = [], rounds = []) {

        this.body = body

        /**
         * Players of the current game.
         * @type {Array<Player>} [ranking=[]]
         */
        this.players = []

        /**
         * All players that have played.
         */
        this.ranking = ranking_players

        /**
         * Cards of the current game.
         */
        this.player_cards = player_cards

        /**
         * Rounds defined in the configuration page.
         */
        this.rounds = rounds

    }

    /**
     * Clean the current page.
     */
    clear() {
        this.body.innerHTML = ''
    }

    /**
     * @param {'home' | 'selection' | 'config' | 'play'} name
     */
    screen(name) {

        this.clear()

        switch (name) {
            case 'home':
                home(this, this.players)
                break;
            case 'selection':
                selection(this)
                break;
            case 'config':
                config(this)
                break;
            case 'play':
                play(this)
                break;
        }

    }
}
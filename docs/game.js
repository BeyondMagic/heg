// Transformar em imports de tipo apeans depois.

/**
 * @typedef {import('./player_card.js').PlayerCard} PlayerCard
 * @typedef {import('./player.js').Player} Player
 * @typedef {import('./round.js').Round} Round
 */

import { home } from "./screens/home.js"
import { selection } from "./screens/selection.js"
import { config } from "./screens/config.js"
import { prepare } from "./screens/prepare.js"
import { play } from "./screens/play.js"

export class Game {

    /**
     * @param {HTMLElement} body
     * @param {Array<Player>} [players=[]]
     * @param {Array<PlayerCard>} [player_cards=[]]
     * @param {Array<Round>} [rounds=[]] 
     */
    constructor(body, players = [], player_cards = [], rounds = []) {

        this.body = body

        /**
         * Players of the current game.
         */
        this.players = players

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
     * @param {'home' | 'selection' | 'config' | 'prepare' | 'play' | 'results'} name
     */
    screen(name) {

        // Clear the current page.
        this.body.innerHTML = ''

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
            case 'prepare':
                prepare(this)
                break;
            case 'play':
                play(this)
                break;
        }

    }
}
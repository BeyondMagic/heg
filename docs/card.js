import { sleep } from "./utils.js"

export class Card extends HTMLElement {

    /**
     * @param {string} value
     * @param {number} index 
     */
    constructor(value, index) {
        super()

        this.classList.add('card')

        /**
         * Value of this card (which is shown)
         */
        this.textContent = value
    }

    /**
     * Swap the values of this card with another one, `card`.
     * @param {Card} card
     */
    async swap (card) {

        this.classList.add('selected', 'swapping');
        card.classList.add('selected', 'swapping');

        const value = this.textContent

        this.textContent = card.textContent
        card.textContent = value

        await sleep(500);

        this.classList.remove('selected', 'swapping');
        card.classList.remove('selected', 'swapping');

    }

}

customElements.define("game-card", Card);
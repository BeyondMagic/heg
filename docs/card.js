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

        /**
         * Position of the index in the shuffled array (to switch there, too!)
         */
        this.index = index
    }

    /**
     * Swap the values of this card with another one, `card`.
     * @param {Card} card
     */
    async swap (card) {

        this.classList.add('selected', 'swapping');
        card.classList.add('selected', 'swapping');

        const temp = {
            value: this.textContent,
            index: this.index
        };

        [this.textContent, this.index] = [card.textContent, card.index];
        [card.textContent, card.index] = [temp.value, temp.index];

        await sleep(500);

        this.classList.remove('selected', 'swapping');
        card.classList.remove('selected', 'swapping');

    }

}

customElements.define("game-card", Card);
export class PlayerCard extends HTMLElement {

    /**
     * @param {string} name
     */
    constructor(name = "Nome") {
        super()

        /**
         * Name of player.
         */
        this.name = name
        
        /**
         * Input for player to put their name.
         */
        this.input = document.createElement('input')
        this.input.type = 'text'
        this.input.value = this.name

        // When changing character, should update name attribute.
        this.input.addEventListener('change', () => {
            this.name = this.input.value
        })

        /**
         * Remove this card.
         */
        const remove = document.createElement('div')
        remove.classList.add('button', 'remove')
        remove.textContent = 'X'
        remove.addEventListener('click', () => this.remove())

        this.append(this.input, remove)
    }

}

customElements.define("player-card", PlayerCard);
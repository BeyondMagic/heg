export class Bar extends HTMLElement {
    /**
     * @param {string} name
     * @param {number} percentage 
     */
    constructor(name, percentage) {
        super()

        /**
         * Name of the player.
         */
        this.name = name

        /**
         * Percentage between 0 and 100%.
         */
        this.percentage = percentage

        const label = document.createElement('div');
        label.classList.add('name')
        label.textContent = name

        const bar = document.createElement("div");
        bar.classList.add('bar')
        bar.style.height = percentage.toString() + '%'


        this.append(label, bar)
    }

}

customElements.define("ranking-bar", Bar);
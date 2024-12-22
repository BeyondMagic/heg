export class Bar extends HTMLElement {
    /**
     * @param {string} name
     * @param {number} percentage 
     * @param {number} position 
     */
    constructor(name, percentage, position) {
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
        bar.style.height = `${percentage}%`;

        const container = document.createElement("div");
        container.classList.add('container')
        container.append(bar)

        const rank = document.createElement("div");
        rank.classList.add('position')
        rank.style.fontWeight = 'bold';
        rank.textContent = `${position}`

        this.append(label, container, rank)
    }

}

customElements.define("ranking-bar", Bar);
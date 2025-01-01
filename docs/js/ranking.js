export class Ranking extends HTMLElement {
    /*
     * @param {string} name Name of the player.
     * @param {number} points How many points for this position.
     * @param {number} percentage Percentage between 0 and 100%.
     * @param {number} rank Position of the player in the ranking.
     */
    constructor(name, points, percentage, number) {
        super()

        this.append(
            this.label(name),
            this.bar(points, percentage),
            this.position(number)
        )
    }

    /**
     * @param {string} name
     * @private
     */
    label(name) {
        const label = document.createElement('div');
        label.classList.add('name', 'center')
        label.textContent = name

        const container = document.createElement("div");
        container.classList.add('container', 'name', 'center')
        container.append(label)

        return container
    }

    /**
     * @param {number} points 
     * @param {number} percentage 
     * @private
     */
    bar(points, percentage) {
        const bar = document.createElement("div");
        bar.classList.add('bar', 'center')
        bar.style.height = `${percentage}%`;
        console.log(bar.style.height)

        bar.textContent = points.toString()

        const container = document.createElement("div");
        container.classList.add('container', 'bar')
        container.append(bar)

        return container
    }

    /**
     * @param {number} number
     * @private
     */
    position(number) {
        const rank = document.createElement("div");
        rank.classList.add('rank', 'center')
        rank.style.fontWeight = 'bold';
        rank.textContent = `${number}º`

        const container = document.createElement("div");
        container.classList.add('container', 'rank', 'center')
        container.append(rank)

        return container
    }

}

customElements.define("ranking-player", Ranking);
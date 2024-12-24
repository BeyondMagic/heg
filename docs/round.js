/**
 * @typedef {import('./module.js').Module} Module
 */
import { Numbers } from './modules/numbers.js'
import { Japanese } from './modules/japanese.js'

/**
 * Modules, access them with their name.
 * @type {Map<string, Module>}
 */
const modules = new Map()
for (const module of [ Numbers, Japanese ]) {
    modules.set(module.name, module)
}

export class Round extends HTMLElement {

    /**
     * 
     * @param {string} name 
     * @param {string} type 
     * @param {number} quantity 
     * @param {number} timer
     */
    constructor(name, type, quantity, timer) {
        super()

        this.classList.add('round')

        /**
         * Saved name of round to use on re-render.
         */
        this.pre_name = name

        /**
         * Saved name of type to use on re-render.
         */
        this.pre_type = type

        /**
         * Module of this round.
         */
        this.module = modules.get(name)

        if (!this.module)
            throw Error(`This module, "${name}", does not exist.`)

        /**
         * Select type of module.
         */
        this.name = document.createElement('select')
        this.name.classList.add('deck')
        this.name.value = this.module.name

        for (const [name, _] of modules){
            const option = document.createElement('option')
            option.value = name
            option.text = name
            this.name.append(option)
        }

        this.name.addEventListener('change', () => {
            const module = modules.get(this.name.value)
            if (!module)
                throw Error("Changed to a module that does not exist.")
            this.module = module
            this.render_types()
        })

        /**
         * Select difficulty of round.
         */
        this.type = document.createElement('select')
        this.type.classList.add('type')
        this.type.value = type

        for (const type of this.module.types)
        {
            const option = document.createElement('option')
            option.value = type
            option.text = type
            this.type.append(option)
        }

        /**
         * Select how many this rounds should repeat.
         */
        this.quantity = document.createElement('input')
        this.quantity.classList.add('quantity')
        this.quantity.value = quantity.toString()
        this.quantity.type = 'number'
        this.quantity.min = '1'

        /**
         * Set timer for each round.
         */
        this.timer = document.createElement('input')
        this.timer.classList.add('timer-input')
        this.timer.value = timer.toString()
        this.timer.type = 'number'
        this.timer.min = '1'

        /**
         * Remove this card.
         */
        const remove = document.createElement('div')
        remove.classList.add('button', 'remove')
        remove.textContent = 'X'
        remove.addEventListener('click', () => this.remove())

        this.append(this.name, this.type, this.quantity, this.timer, remove)
    }

    /**
     * @private
     */
    render_types() {
        this.type.value = this.module.types[0]
        this.type.innerHTML = ''
        
        for (const type of this.module.types)
        {
            const option = document.createElement('option')
            option.value = type
            option.text = type
            this.type.append(option)
        }
    }

}

customElements.define("game-round", Round);
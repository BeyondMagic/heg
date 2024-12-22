/**
 * Serves as the template for new modules.
 * @class
 * @constructor
 */
export class Module {

	/**
	 * @param {string} name
	 * @param {Array<string>} types
	 * @param {(param1: string) => Array<string>} render Return deck of cards. If returns empty, type should not exist.
	 **/
	constructor(name, types, render) {
		/**
		 * Name of the module.
		 **/
		this.name = name

		/**
		 * Types of decks to choose.
		 **/
		this.types = types

		/**
		 * Render deck.
		 **/
		this.render = render
	}
}
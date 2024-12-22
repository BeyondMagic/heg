import { Module } from "../module.js"

/**
* @param {"easy" | string} difficulty 
* @returns Array<string>
*/
function render(difficulty) {
	switch (difficulty) {
		case "easy":
			return [
				"私",
				"が",
				"ジョン",
				"です",
				"。"
			]
        break;
	}
	return []
}

export const Japanese = new Module(
	"Frases japonesas",
	[
		"easy"
	],
	render
)
import { Module } from "../module.js"

/**
 * Return a random number in the the range min to max (inclusive).
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Returns
 * @param {number} min
 * @param {number} max
 * @param {number} amount
 * @returns {Array<string>} 
 */
function numbers(min, max, amount) {
    const numbers = new Set()
    while (numbers.size < amount)
        numbers.add(random(min ,max).toString())
    return Array.from(numbers)
}
/**
* @param {"tutorial" | "fácil" | "médio" | "difícil" | string} difficulty 
* @returns Array<string>
*/
export function render(difficulty) {
    switch (difficulty) {
        // 2 ~ 3 numbers between 1 and 10
        case "tutorial":
            return numbers(
                1, 
                10, 
                random(2, 3)
            )

        // 4 ~ 9 numbers between 1 and 15
        case "fácil":
            return numbers(
                1,
                15,
                random(4, 9)
            )

        // 10 ~ 19 numbers between 1 and 30
        case "médio":
            return numbers(
                1,
                30,
                random(10, 19)
            )

        // 20 ~ 30 numbers between 1 and 50
        case "difícil":
            return numbers(
                1,
                50,
                random(20, 30)
            )
    }
    return []
}

export const Numbers = new Module(
    "Números",
    [
        "tutorial",
        "fácil",
        "médio",
        "difícil"
    ],
    render
)
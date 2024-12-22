import { Module } from "../module.js"

/**
 * @param {number} min
 * @param {number} max
 * @param {number} amount
 * @returns {Array<number>} 
 */
function generateRandomNumbers(min, max, amount) {
    const numbers = new Set()
    while (numbers.size < amount) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min
        numbers.add(randomNum)
    }
    return Array.from(numbers)
}

/**
* @param {"tutorial" | "easy" | "mid" | "hard" | string} difficulty 
* @returns Array<string>
*/
function render(difficulty) {
    switch (difficulty) {
        case "tutorial":
            return generateRandomNumbers(1, 10, Math.floor(Math.random() * (3 - 2 + 1)) + 2);// 2 ~ 3 numbers between 1 and 10
        case "easy":
            return generateRandomNumbers(1, 15, Math.floor(Math.random() * (9 - 4 + 1)) + 4) // 4 ~ 9 numbers between 1 and 15
        case "mid":
            return  generateRandomNumbers(1, 30, Math.floor(Math.random() * (19 - 10 + 1)) + 10) // 10 ~ 9 numbers between 1 and 30
        case "hard":
            return generateRandomNumbers(1, 50, Math.floor(Math.random() * (30 - 20 + 1)) + 20) // 20 ~ 30 numbers between 1 and 50
        default:
            return []
    }
}

export const Japanese = new Module(
    "Frases japonesas",
    [
        "easy"
    ],
    render
)
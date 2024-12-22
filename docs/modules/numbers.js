import { Module } from "../module.js"



/**
* @param {"easy" | string} difficulty 
* @returns Array<string>
*/
function render(difficulty) {
    switch (difficulty) {
        case "tutorial":
            return // 2 ~ 3 numbers between 1 and 10
        break;

        case "easy":
            return // 4 ~ 9 numbers between 1 and 15
        break;

        case "mid":
            return // 10 ~ 9 numbers between 1 and 30
        break;

        case "hard":
            return // 20 ~ 30 numbers between 1 and 50
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
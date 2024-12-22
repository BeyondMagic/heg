import { Player, sort } from "./player.js";

const Renan = new Player("Renan", 10);
const Joao = new Player("Joao", 25);
const Andre = new Player("Andre", 5);

const result = sort([ Renan, Joao, Andre ])

const ranking = document.querySelector('.ranking');

if (ranking instanceof HTMLElement)
{
    const best = result[0].points;

    console.log(ranking)

    for (const player of result)
        ranking.append(player.bar(best))
}
/**
 * @typedef {import('../round.js').Round} Round
 * @typedef {import('../game.js').Game} Game
 * @typedef {{total: number, took: number, swaps: number}} Turn
 * @typedef {{interval: number, resolve: (value: void | PromiseLike<void>) => void}} Clear
 */

import { Card } from '../card.js';
import { Player } from '../player.js';
import { sleep, shuffle } from '../utils.js';
import { prepare } from './prepare.js';  
import { results } from './results.js';


/**
 * Update progress bar and returns if it's corrected.
 * @param {Array<string>} original
 * @param {Array<Card>} player_cards 
 * @param {HTMLElement} bar 
 * @returns {boolean}
 */
function update_progress (original, player_cards, bar) {

    const correct = player_cards.reduce(
        (accumulated, card, index) =>
        (card.textContent === original[index] ? accumulated + 1 : accumulated)
    , 0)

    const progress = Math.round((correct / player_cards.length) * 100);
    bar.style.width = `${progress}%`;

    console.log(progress);

    return progress === 100;
}

/**
 * End this turn.
 * @param {Player} player 
 * @param {Turn} time
 * @param {Clear} clear
 */
async function end (player, time, clear) {  
    window.clearInterval(clear.interval);

    // To-do: animation of ending.
    console.log(`Player "${player.name} took"`, time)

    await sleep(5000);
    // To-do: calculate pontuation of player.

    clear.resolve()
}

/**
 * Start timer of this turn.
 * @param {Player} player
 * @param {HTMLElement} timer 
 * @param {Turn} turn
 * @param {(value: void | PromiseLike<void>) => void} resolve End the turn.
 * @returns {number}
 */
function start_timer (player, timer, turn, resolve) { 
    const interval = window.setInterval(() => {
        if (--turn.took)
            timer.textContent = `Tempo restante: ${turn.took}!`
        else
            end(player, turn, {interval, resolve})
    }, 1000)

    return interval
}

/**
 * Play turn of player.
 * @param {Game} game 
 * @param {Player} player 
 * @param {{original: Array<string>, shuffled: Array<string>}} deck
 * @param {number} seconds
 * @returns {Promise<void>}
 */
async function turn (game, player, deck, seconds) {

    const container = {
        player: document.createElement('div'),
        cards: document.createElement('div'),
        timer: document.createElement('div'),
        progress: document.createElement('div'),
    }

    // Player title.
    container.player.classList.add('player', 'title')
    container.player.textContent = `Turno de: ${player.name}`
    
    // Container to put cards.
    container.cards.classList.add('cards-container')

    // Timer to wait sorting of cards.
    container.timer.classList.add('timer', 'turn')
    container.timer.textContent = `Tempo restante: ${seconds}!`

    // Progress bar of shuffled deck.
    container.progress.classList.add('progress-bar-container')
    const bar = document.createElement('div')
    bar.classList.add('progress-bar')
    bar.style.width = '0%';

    container.progress.append(bar)

    /**
     * Selected card to swap.
     * @type {Card | null}
     */
    let selected_card = null;

    game.body.append(
        container.player,
        container.cards,
        container.timer,
        container.progress
    )

    // Resolve when `player_cards` is sorted.
    return new Promise(async resolve => {

        /**
         * @type {Turn}
         */
        const turn = {
            total: seconds,
            took: seconds,
            swaps: 0
        }

        /**
         * @type {Clear}
         */
        const clear = {
            interval: start_timer(player, container.timer, turn, resolve),
            resolve,
        }

        /**
         * @type {Array<Card>}
         */
        const player_cards = []

        for (const [index, value] of deck.shuffled.entries())
        {
            const card = new Card(value, index)
            player_cards.push(card)
    
            card.addEventListener('click', async () => {
    
                // If has selected card.
                if (!selected_card)
                {
                    // Select this card.
                    card.classList.add('selected')
                    selected_card = card;
                    return;
                }

                // If same card, unselect.
                if (selected_card == card)
                {
                    selected_card.classList.remove('selected')
                
                // If card different, swap.
                } else {
                    ++player.swaps;
                    ++turn.swaps;
                    card.swap(selected_card);

                    const is_sorted = update_progress(deck.original, player_cards, bar)
                
                    if (is_sorted)
                        await end(player, turn, clear);
                }

                selected_card = null;
            })
    
            container.cards.append(card)
        }

        const is_sorted = update_progress(deck.original, player_cards, bar)
                
        if (is_sorted)
            await end(player, turn, clear);
    })
}

/**
 * Play a new game.
 * @param {Game} game
 */
export async function play (game) {

    for (const round of game.rounds)
    {
        const repeat = Number.parseInt(round.quantity.value)

        for (let i = 1; i <= repeat; ++i)
        {
            const original = round.module.render(round.type.value)

            const deck = {
                original: original,
                shuffled: shuffle(original)
            }

            const seconds = Number.parseInt(round.timer.value)

            for (const player of game.players)
            {
                console.log(`Preparing ${player.name} to play ${round.name.value} in ${i} time.`)
                game.clear()
                await prepare(game, player)
                await turn(game, player, deck, seconds)
            }

            game.clear()
            results(game, 'between')
        }
    }

    game.clear()
    results(game, 'end')
}
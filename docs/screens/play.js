/**
 * @typedef {import('../round.js').Round} Round
 * @typedef {import('../game.js').Game} Game
 * @typedef {{total: number, left: number, swaps: number, progress: number}} Turn
 * @typedef {{average: number, best: number}} Metric
 * @typedef {{interval: number, resolve: (value: void | PromiseLike<void>) => void}} Clear
 */

import { Card } from '../card.js';
import { Player } from '../player.js';
import { sleep } from '../utils.js';
import { prepare } from './prepare.js';  
import { results } from './results.js';
import { shuffle, average_swaps, min_swaps } from '../module.js';

/**
 * Update progress bar and returns if it's corrected.
 * @param {Turn} turn 
 * @param {Array<string>} original
 * @param {Array<Card>} player_cards 
 * @param {HTMLElement} bar 
 * @returns {boolean}
 */
function update_progress (turn, original, player_cards, bar) {

    const correct = player_cards.reduce(
        (accumulated, card, index) =>
        (card.textContent === original[index] ? accumulated + 1 : accumulated)
    , 0)

    const progress = Math.round((correct / player_cards.length) * 100);
    bar.style.width = `${progress}%`;

    turn.progress = progress;

    return progress === 100;
}

/**
 * Calculate the points of the player... (simple calculation).
 * @param {Player} player
 * @param {Turn} turn
 * @param {Metric} swaps
 * @returns {number}
 */
function calculate_points (player, turn, swaps) {

    // Base is 100 because of percentage.
    const base = 100

    // Small penalty (20% close above).
    const close_range = 1.25
    
	let points = turn.progress

    // Scale time to half.
	let timeBonus = Math.round((turn.left / turn.total) * base / 2);
    const close_best = Math.round(swaps.best * close_range)

    let penalty = 0;

    // If paassed the average, then penalty.
    if (turn.swaps > swaps.average)
        penalty = (turn.swaps - swaps.average) * 5;
    
    // If equal to minimum, bonus.
    else if (turn.swaps === swaps.best)
        penalty = -base * 2;

    // If above the close range for best, then small penalty.
    else if (turn.swaps > close_best)
        penalty = (turn.swaps - swaps.best) * 2;

    // Smallest penalty for getting too close
    else if (turn.swaps <= close_best)
        penalty = (turn.swaps - swaps.best);

	// If array is completely sorted, then extra points!!!
	const bonus = turn.progress === base ? base : 0;

	const total = points + timeBonus - penalty + bonus;

    // No negative points!
	return Math.max(0, total);
}

/**
 * End this turn.
 * @param {Player} player 
 * @param {Turn} turn
 * @param {Metric} swaps 
 * @param {Clear} clear
 */
async function end (player, turn, swaps, clear) {  
    window.clearInterval(clear.interval);

    const turn_points = calculate_points(player, turn, swaps);
    player.points += turn_points;

    console.log(`Player "${player.name} took"`, turn, `and got ${turn_points} points for a total of ${player.points}.`)

    // To-do: animation of ending.
    
    await sleep(5000);

    console.log(player.points)

    clear.resolve()
}

/**
 * Start timer of this turn.
 * @param {Player} player
 * @param {HTMLElement} timer 
 * @param {Turn} turn
 * @param {Metric} swaps
 * @param {(value: void | PromiseLike<void>) => void} resolve End the turn.
 * @returns {number}
 */
function start_timer (player, timer, turn, swaps, resolve) { 
    const interval = window.setInterval(() => {
        if (--turn.left)
            timer.textContent = `Tempo restante: ${turn.left}!`
        else
            end(player, turn, swaps, {interval, resolve})
    }, 1000)

    return interval
}

/**
 * Play turn of player.
 * @param {Game} game 
 * @param {Player} player 
 * @param {{original: Array<string>, shuffled: Array<string>}} deck
 * @param {Metric} swaps 
 * @param {number} seconds
 * @returns {Promise<void>}
 */
async function turn (game, player, deck, swaps, seconds) {

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
            left: seconds,
            swaps: 0,
            progress: 0
        }

        /**
         * @type {Clear}
         */
        const clear = {
            interval: start_timer(player, container.timer, turn, swaps, resolve),
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

                    const is_sorted = update_progress(turn, deck.original, player_cards, bar)
                
                    if (is_sorted)
                        await end(player, turn, swaps, clear);
                }

                selected_card = null;
            })
    
            container.cards.append(card)
        }

        const is_sorted = update_progress(turn, deck.original, player_cards, bar)
                
        if (is_sorted)
            await end(player, turn, swaps, clear);
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

            /**
             * @type {Metric}
             */
            const swaps = {
                average: min_swaps(deck.original, deck.shuffled),
                best: min_swaps(deck.original, deck.shuffled)
            }


            const seconds = Number.parseInt(round.timer.value)

            for (const player of game.players)
            {
                console.log(`Preparing ${player.name} to play ${round.name.value} in ${i} time.`)
                game.clear()
                await prepare(game, player)
                await turn(game, player, deck, swaps, seconds)
            }

            game.clear()
            results(game, 'between')
        }
    }

    game.clear()
    results(game, 'end')
}
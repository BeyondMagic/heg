
/**
 * Shuffle an array using Fisher–Yates (aka Knuth) algorithm.
 * @param {Array<string>} array 
 */
export function shuffle (array) {
    const copy = [...array]
    for (let i = copy.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy
}

/**
 * Create a promise to wait for `ms` miliseconds.
 * @param {number} ms 
 * @returns {Promise<void>}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
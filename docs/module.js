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
		 * Render deck, return a sorted array by type.
		 **/
		this.render = render
	}
}

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
 * Merge two halves and count inversions.
 * @param {Array<number>} array Mergin array.
 * @param {Array<number>} temp Temporary array to put halves.
 * @param {number} left 
 * @param {number} mid 
 * @param {number} right 
 * @returns 
 */
function merge_count(array, temp, left, mid, right) {
	let i = left;
	let j = mid + 1;
	let k = left;

	let count = 0;

	// Traversing both subarrays...
	while (i <= mid && j <= right) {
		if (array[i] <= array[j])
			temp[k++] = array[i++];
		else {
			temp[k++] = array[j++];
			count += (mid - i + 1);
		}
	}

	while (i <= mid)
		temp[k++] = array[i++];
	
	while (j <= right)
		temp[k++] = array[j++];

	
	for (let m = left; m <= right; m++) 
		array[m] = temp[m];

	return count;
}

// Helper function for divide-and-conquer
/**
 * 
 * @param {Array<number>} array Merging array.
 * @param {Array<number>} temp Temporary array.
 * @param {number} left 
 * @param {number} right 
 * @returns 
 */
function merge_sort_count(array, temp, left, right) {
	let count = 0;

	if (left < right) {
		let mid = Math.floor((left + right) / 2);

		// Left.
		count += merge_sort_count(array, temp, left, mid);

		// Right.
		count += merge_sort_count(array, temp, mid + 1, right);

		// Swaps.
		count += merge_count(array, temp, left, mid, right);
	}

	return count;
}

/**
 * Prepare array of strings to be sorted by algorithms.
 * @param {Array<string>} original
 * @param {Array<string>} shuffled 
 * @returns {Array<number>}
 */
function prepare_array (original, shuffled)
{
	return shuffled.map(item => original.indexOf(item))
}

/**
 * Count the number of swaps (inversions) of an original array compared
 * to a shuffled array.
 * @param {Array<string>} original
 * @param {Array<string>} shuffled 
 * @returns {number}
 */
export function average_swaps(original, shuffled)
{
	const index_array = prepare_array(original, shuffled)

    let temp = Array(index_array.length);
    
    return merge_sort_count(index_array, temp, 0, index_array.length - 1);
}

/**
 * Return minimum quantity of swaps to sort the array!
 * Uses greedy algorithm!
 * @param {Array<string>} original
 * @param {Array<string>} shuffled 
 * @returns {number}
 */
export function min_swaps(original, shuffled)
{
	const array = prepare_array(original, shuffled)
	
    let n = array.length;
 
    // Create two arrays and use as pairs where first
    // array is element and second array is position of first element
    let position = [];
    for (let i = 0; i < n; i++)
         position.push([array[i], i]);

    // Sort the array by array element values to get right
	// position of every element as the elements of second array.
    position.sort((a, b) => a[0] - b[0]);

    // To keep track of visited elements.
	// Initialize all elements as not visited or false.
    let visited = new Array(n);
    for(let i = 0 ; i < n ; i++)
        visited[i] = false;
    
    // Initialize result
    let count = 0;
     
    // Traverse array elements
    for (let i = 0; i < n; i++)
    {
        // already swapped and corrected or
        // already present at correct pos
        if (visited[i] || position[i][1] == i)
            continue;

        // find out the number of  node in
        // this cycle and add in ans
        let cycle_size = 0;
        let j = i;

        while (!visited[j])
        {
            visited[j] = true;

            // move to next node
            j = position[j][1];
            
            cycle_size++;
        }

        // Update answer by adding current cycle.
        if (cycle_size > 0)
            count += (cycle_size - 1);
    }

    return count;
}
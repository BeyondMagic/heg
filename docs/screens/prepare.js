/**
 * @typedef {import('../game.js').Game} Game
 */

/**
 * Prepare the next player to play their turn.
 * @param {Game} game
 */
export function prepare(game) {

    /**
     * Next player to play is the first one in the list.
     */
    const player = game.players[0]
    const startButton = document.createElement('div')
    const instructions = document.createElement('div')
    const playerTurn = document.createElement('div')

    playerTurn.classList.add('player-turn')
    playerTurn.textContent = `Vez de ${player.name} jogar!`
    
    
    instructions.textContent = 'Prepare-se para jogar!\nClique em Começar quando estiver pronto!'
    instructions.classList.add('instructions')
    startButton.classList.add('start', 'prepare-button')
    startButton.textContent = 'Pronto!'

    startButton.addEventListener('click', () => {
        instructions.remove()
        startButton.remove()
        let timer = 3;
        const countdown = document.createElement('h2')
        countdown.classList.add('timer')
        countdown.textContent = `${timer}`;
        game.body.append(countdown)
        const interval = window.setInterval(async () => {
            timer -= 1;
            if(timer > 0)
                countdown.textContent = timer.toString();
            // When timer is over.
            else if (timer === 0) {
                countdown.textContent = 'Vai!'
            }
            
            // Two seconds of transition into game;
            else if (timer < -2) {
                window.clearInterval(interval)
                // await sleep(2000)
                game.screen('play')
            }            
        }, 1000)
    })
    
    game.body.append(playerTurn, instructions, startButton)
}
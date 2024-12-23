/**
 * @typedef {import('../game.js').Game} Game
 */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @param {Game} game
 */
export function play (game) {
    // this.rounds = vai ser as rodadas definidas no começo do jogo
    // a próxima rodada é sempre a primeira
    // a gente dele a primeira depois de acabar a rodada
    const players = game.players
    const roundConfig = game.rounds[0]
    const totalRounds = parseInt(roundConfig?.rounds.value)
    const gameDifficulty = roundConfig?.type.value;
    let currentRound = 1
    let currentPlayer = 0;
    let seconds = parseInt(roundConfig?.timer.value)

    // title element
    const playerTurn = document.createElement('div')
    playerTurn.classList.add('player-turn')
    playerTurn.textContent = `Turno de: ${players[currentPlayer].name}`

    // cards element
    const cardsContainer = document.createElement('div')
    cardsContainer.classList.add('cards-container')

    // generate used numbers
    // use first module in the array
    const shuffledCards = roundConfig.module.render(gameDifficulty)
    const correctOrder = shuffledCards.slice().sort((a, b) => (Number.parseInt(a) - Number.parseInt(b)))

    console.log("before:", shuffledCards)
    console.log("correct:", correctOrder)
    shuffledCards.sort(() => Math.random() - 0.5)
    let currentOrder = shuffledCards.slice()
    console.log("after:", currentOrder)
    
    // timer
    const timer = document.createElement('div')
    timer.classList.add('timer', 'turn')
    timer.textContent = `Tempo restante: ${seconds}`
    
    //progress bar
    const progressBarContainer = document.createElement('div')
    progressBarContainer.classList.add('progress-bar-container')
    const progressBar = document.createElement('div')
    progressBar.classList.add('progress-bar')
    progressBar.style.width = '0%'
    progressBarContainer.appendChild(progressBar)

    const updatePlayerTurnTitle = () => {
        playerTurn.textContent = `Turno de: ${players[currentPlayer].name}`
    }

    const startTimerInterval = () => { 
        const timerInterval = setInterval(() => {
            seconds--;
            if(seconds === 0) {
                clearInterval(timerInterval)
                alert('Acabou o tempo!')
                
                endTurn()
            } else {
                timer.textContent = `Tempo restante: ${seconds}`
            }
        }, 1000)
    }

    const startTurn = () => {
        seconds = parseInt(roundConfig?.timer.value)
        updatePlayerTurnTitle()
        updateProgressBar()

        currentOrder = shuffledCards.slice()
        cardsContainer.innerHTML = ''
        shuffledCards.forEach((value,index) => {
            const card = document.createElement('div')
            card.classList.add('card')
            card.textContent = value.toString()
            card.dataset.index = index.toString()
            card.addEventListener('click', () => handleCardClick(card))
            cardsContainer.appendChild(card)
        });

        timer.textContent = `Tempo restante: ${seconds}`
        startTimerInterval()
    }

    const endTurn = () => {
        currentPlayer++
        if(currentPlayer >= players.length) {
            currentPlayer = 0;
            currentRound++
        }

        if(currentRound > totalRounds) {
            alert('Jogo concluídol!')
            game.screen('results')
            return
        }

        startTurn();
    }
   
    const updateProgressBar = () => {
        const correcPositions =  currentOrder.reduce((acc, val, idx) => 
            (val === correctOrder[idx] ? acc + 1 : acc), 0
        )
        const progress = Math.round((correcPositions / currentOrder.length) * 100)
        progressBar.style.width = `${progress}%`
    }

    let firstCardSelected = null;
    const swaps = [];
    let isSwapping = false;

    // por turno: criar swap, salvar por jogador

    // para cada rodada
        // para cada rodada.quantidade
            // para cada jogador
                // tela prepara
                // ele joga
                // salva swaps (inversões)
            // ranking dessa rodada
    // acabou todas as rodadas e quantidades
    // ranking geral
    // salva os players no LocalStorage
    
    const handleCardClick = (card) => {
        if(isSwapping) return;

        if(firstCardSelected === null) {
            firstCardSelected = card;
            card.classList.add('selected');
        }
        else if(card === firstCardSelected) {
            firstCardSelected.classList.remove('selected');
            firstCardSelected = null;
        }
        else {
            const secondCardSelected = card;

            swaps.push( {
                first: {index: firstCardSelected.dataset.index, value: firstCardSelected.textContent},
                second: {index: secondCardSelected.dataset.index, value: secondCardSelected.textContent},
            })

            isSwapping = true;
            firstCardSelected.classList.add('swapping');
            secondCardSelected.classList.add('swapping');   

            setTimeout(async () => {
                const temp = firstCardSelected.textContent;
                firstCardSelected.textContent = secondCardSelected.textContent;
                secondCardSelected.textContent = temp;

                firstCardSelected.classList.remove('selected', 'swapping');
                secondCardSelected.classList.remove('selected', 'swapping');
                
                const firstIndex = parseInt(firstCardSelected.dataset.index);
                const secondIndex = parseInt(secondCardSelected.dataset.index);
                [currentOrder[firstIndex], currentOrder[secondIndex]] = [
                    currentOrder[secondIndex],
                    currentOrder[firstIndex],
                ];

                firstCardSelected = null;
                isSwapping = false;

                updateProgressBar();

                if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
                    await sleep(1500) 
                    alert("Parabéns! Você ordenou todos os cartões!");
                    endTurn();
                }
            }, 500);

            
        }
    }

    console.log("Swaps:", swaps)

    game.body.append(playerTurn, cardsContainer, timer, progressBarContainer)
    
    startTurn()
}
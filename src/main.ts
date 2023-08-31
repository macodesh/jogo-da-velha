import './style.css'

const x = document.querySelector('.x') as HTMLDivElement
const o = document.querySelector('.o') as HTMLDivElement
const boxes = document.querySelectorAll('.box') as NodeListOf<HTMLDivElement>
const buttons = document.querySelectorAll(
  '#buttons-container button'
) as NodeListOf<HTMLButtonElement>
const msgContainer = document.querySelector('#message') as HTMLDivElement
const msgText = document.querySelector('#message p') as HTMLParagraphElement
const scoreBoard1 = document.querySelector('#scoreboard-1') as HTMLSpanElement
const scoreBoard2 = document.querySelector('#scoreboard-2') as HTMLSpanElement

let secondPlayer: string | null

let player1Turns = 0
let player2Turns = 0
const lastTurn = 5

function setAiTurn(box: Node): void {
  box.appendChild(x.cloneNode(true))

  for (let i = 0; i < boxes.length; i++) {
    const random = Math.floor(Math.random() * 9)

    if (boxes[random].childNodes[0] === undefined) {
      boxes[random].appendChild(o.cloneNode(true))
      break
    }
  }

  player1Turns++
  player2Turns++
}

function setPlayerTurn(): Node {
  if (player1Turns === player2Turns) {
    player1Turns++
    return x.cloneNode(true)
  } else {
    player2Turns++
    return o.cloneNode(true)
  }
}

function hasThreeEquals(
  box1: HTMLDivElement,
  box2: HTMLDivElement,
  box3: HTMLDivElement
): number {
  if (
    box1.children[0].classList.contains('x') &&
    box2.children[0].classList.contains('x') &&
    box3.children[0].classList.contains('x')
  ) {
    return 1
  } else if (
    box1.children[0].classList.contains('o') &&
    box2.children[0].classList.contains('o') &&
    box3.children[0].classList.contains('o')
  ) {
    return 2
  } else return 0
}

function resetGame(): void {
  player1Turns = 0
  player2Turns = 0

  boxes.forEach((box) => {
    box.innerHTML = ''
  })
}

function declareWinner(result: number): void {
  msgContainer.classList.remove('hide')

  if (result !== 0) {
    msgText.textContent = `O vencedor é: player ${result}`
  } else {
    msgText.textContent = 'Deu velha!'
  }

  setTimeout(() => {
    msgContainer.classList.add('hide')
    resetGame()
  }, 3000)

  if (result === 1) {
    scoreBoard1.textContent = (+scoreBoard1.textContent! + 1).toString()
  } else if (result === 2) {
    scoreBoard2.textContent = (+scoreBoard2.textContent! + 1).toString()
  }
}

function hasThreeChildren(
  box1: HTMLDivElement,
  box2: HTMLDivElement,
  box3: HTMLDivElement
): boolean {
  if (
    box1.children.length > 0 &&
    box2.children.length > 0 &&
    box3.children.length > 0
  ) {
    return true
  } else return false
}

function checkWinner(): void {
  const rowsAndColumns = [
    { box1: boxes[0], box2: boxes[1], box3: boxes[2] },
    { box1: boxes[3], box2: boxes[4], box3: boxes[5] },
    { box1: boxes[6], box2: boxes[7], box3: boxes[8] },
    { box1: boxes[0], box2: boxes[3], box3: boxes[6] },
    { box1: boxes[1], box2: boxes[4], box3: boxes[7] },
    { box1: boxes[2], box2: boxes[5], box3: boxes[8] },
    { box1: boxes[0], box2: boxes[4], box3: boxes[8] },
    { box1: boxes[2], box2: boxes[4], box3: boxes[6] }
  ]

  for (let i = 0; i < rowsAndColumns.length; i++) {
    const { box1, box2, box3 } = rowsAndColumns[i]

    if (!hasThreeChildren(box1, box2, box3)) continue

    const result = hasThreeEquals(box1, box2, box3)
    if (result !== 0) {
      declareWinner(result)
      break
    } else if (player1Turns === lastTurn) declareWinner(0)
  }
}

boxes.forEach((box) => {
  box.addEventListener('click', function () {
    if (this.childNodes.length === 0 && secondPlayer !== 'ai-player') {
      const clone = setPlayerTurn()
      this.appendChild(clone)
    }
    if (this.childNodes.length === 0) {
      setAiTurn(this)
    }

    if (player1Turns >= 3) {
      checkWinner()
    }
  })
})

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    secondPlayer = this.getAttribute('id')

    buttons[0].style.display = 'none'
    buttons[1].style.display = 'none'

    setTimeout(() => {
      const container = document.querySelector('#container') as HTMLDivElement
      container.classList.remove('hide')
    }, 500)
  })
}

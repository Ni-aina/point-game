window.onload = () => {
  const width = 900

  const height = 600

  const size = 30

  let ctx

  let color = 0

  let Points = Array.from({ length: parseInt(width / size) }, () =>
    new Array(parseInt(height / size)).fill(0)
  )

  let segments = new Set() // Ensemble des segments déjà tracés

  let score1 = 0

  let score2 = 0

  const drawLines = () => {
    for (let i = 1; i < height / size; i++) {
      ctx.moveTo(0, i * size)

      ctx.lineTo(width, i * size)
    }

    for (let i = 1; i < width / size; i++) {
      ctx.moveTo(i * size, 0)

      ctx.lineTo(i * size, height)
    }

    ctx.stroke()
  }

  const drawPoint = (i, j) => {
    if (!Points[i][j]) {
      ctx.beginPath()

      Points[i][j] = color % 2 === 0 ? 1 : 2

      ctx.strokeStyle = color % 2 === 0 ? "red" : "blue"

      ctx.arc(j * size, i * size, 4, 0, Math.PI * 2, true)

      ctx.fill()

      ctx.stroke()

      color++

      tracePath(i, j) // Tracer la trajectoire
    }
  }

  const tracePath = (i, j) => {
    const player = Points[i][j]

    const visited = new Set()

    const stack = [[i, j]]

    const initialPoint = `${i},${j}`

    let isClosedLoop = false

    while (stack.length > 0) {
      const [x, y] = stack.pop()

      const key = `${x},${y}`

      if (visited.has(key)) continue

      visited.add(key)

      // Vérifie les voisins dans toutes les directions (haut, bas, gauche, droite, et diagonales)

      const neighbors = [
        [x + 1, y], // Bas

        [x - 1, y], // Haut

        [x, y + 1], // Droite

        [x, y - 1], // Gauche

        [x + 1, y + 1], // Diagonale bas-droite

        [x + 1, y - 1], // Diagonale bas-gauche

        [x - 1, y + 1], // Diagonale haut-droite

        [x - 1, y - 1], // Diagonale haut-gauche
      ]

      for (const [nx, ny] of neighbors) {
        const neighborKey = `${nx},${ny}`

        const segmentKey = `${Math.min(x, nx)},${Math.min(y, ny)}-${Math.max(
          x,

          nx
        )},${Math.max(y, ny)}`

        if (
          nx >= 0 &&
          nx < Points.length &&
          ny >= 0 &&
          ny < Points[0].length &&
          Points[nx][ny] === player
        ) {
          if (segments.has(segmentKey)) {
            // Si un segment est déjà tracé, on arrête le tracé

            continue
          }

          // Si on atteint le point initial depuis un voisin, c'est une boucle fermée

          if (neighborKey === initialPoint && visited.size > 1) {
            isClosedLoop = true
          } else {
            drawLineBetweenPoints(x, y, nx, ny)

            segments.add(segmentKey) // Marque le segment comme tracé

            stack.push([nx, ny])
          }
        }
      }
    }

    if (isClosedLoop) {
      console.log("Boucle fermée trouvée pour le joueur", player)

      // Incrémenter le score du joueur pour une boucle fermée

      if (player === 1) {
        score1++

        document.getElementById("j1").textContent = score1
      } else {
        score2++

        document.getElementById("j2").textContent = score2
      }
    }
  }

  const drawLineBetweenPoints = (x1, y1, x2, y2) => {
    ctx.beginPath()

    ctx.moveTo(y1 * size, x1 * size)

    ctx.lineTo(y2 * size, x2 * size)

    ctx.strokeStyle = Points[x1][y1] === 1 ? "red" : "blue"

    ctx.lineWidth = 2

    ctx.stroke()

    ctx.closePath()
  }

  const Lines = () => {
    console.table(Points)
  }

  const rounds = () => {
    const Jouer = document.getElementById("Jouer")

    Jouer.style.color = color % 2 === 0 ? "red" : "blue"

    const rd = color % 2 === 0 ? "J1" : "J2"

    Jouer.textContent = rd
  }

  const init = () => {
    const canvas = document.createElement("canvas")

    const div = document.createElement("div")

    document.body.appendChild(div)

    div.style.float = "left"

    const score = document.createElement("h3")

    score.textContent = "Score"

    div.appendChild(score)

    const sc1 = document.createElement("p")

    sc1.style.color = "grey"

    sc1.textContent = "Joueur 1 : "

    div.appendChild(sc1)

    const sp1 = document.createElement("span")

    sp1.id = "j1"

    sp1.style.color = "red"

    sp1.textContent = score1

    sc1.appendChild(sp1)

    const sc2 = document.createElement("p")

    sc2.style.color = "grey"

    sc2.textContent = "Joueur 2 : "

    div.appendChild(sc2)

    const sp2 = document.createElement("span")

    sp2.id = "j2"

    sp2.style.color = "blue"

    sp2.textContent = score2

    sc2.appendChild(sp2)

    const round = document.createElement("h3")

    round.id = "round"

    round.textContent = "Tour : "

    div.appendChild(round)

    const jouer = document.createElement("span")

    jouer.id = "Jouer"

    jouer.style.padding = "0px 3px"

    jouer.style.border = "1px solid grey"

    jouer.style.borderRadius = "2px"

    jouer.style.color = "red"

    jouer.style.fontSize = "17px"

    jouer.style.fontWeight = "bold"

    jouer.textContent = "J1"

    round.appendChild(jouer)

    canvas.width = width

    canvas.height = height

    canvas.style.border = "2px solid grey"

    canvas.style.borderRadius = "3px"

    canvas.style.display = "block"

    canvas.style.margin = "15px auto"

    ctx = canvas.getContext("2d")

    document.body.appendChild(canvas)

    drawLines()

    canvas.onclick = (e) => {
      const widthResp = parseInt(width+(size-15) - window.screen.width/2);
      const cursorX = parseInt((e.clientX-widthResp)/size);

      const cursorY = parseInt(e.clientY / size)

      drawPoint(cursorY, cursorX)

      Lines()

      rounds()
    }
  }

  init()
}

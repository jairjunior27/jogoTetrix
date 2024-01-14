let query = (el) => document.querySelector(el);
let all = (el) => document.querySelectorAll(el);

let col = 12;
let row = 20;

let tela = query(".tela");

for (let i = 0; i < row; i++) {
  for (let j = 0; j < col; j++) {
    if (j === 0 || j === col - 1 || i === row - 1) {
      let noGrid = document.createElement("div");
      noGrid.classList.add("noGrid");
      tela.append(noGrid);
    } else {
      let grid = document.createElement("div");
      grid.classList.add("grid");
      tela.append(grid);
    }
  }
}

const shape_o = [
  [4, 5, 14, 15],
  [4, 5, 14, 15],
  [4, 5, 14, 15],
  [4, 5, 14, 15],
];

const shape_p = [[4], [4], [4], [4]];

const shape_i = [
  [4, 5, 6, 7],
  [4, 14, 24, 34],
  [4, 5, 6, 7],
  [4, 14, 24, 34],
];

const shape_t = [
  [4, 5, 6, 15],
  [4, 14, 24, 13],
  [14, 15, 16, 5],
  [4, 14, 24, 15],
];

const shape_z = [
  [4, 14, 15, 25],
  [14, 15, 5, 6],
  [5, 15, 14, 24],
  [4, 5, 15, 16],
];

const shape_f = [
  [4, 5, 14, 24],
  [4, 5, 6, 16],
  [5, 15, 25, 24],
  [14, 15, 16, 4],
];

let allShape = [shape_f, shape_i, shape_o, shape_t, shape_z, shape_p];
let random = Math.floor(Math.random() * allShape.length);
let shapeRotation = 0;
let currentShape = allShape[random][shapeRotation];
let caixa = all(".grid");
let shapePosition = 0;
let widthShape = 10;
let pontos = 0;

let color = ["red", "green", "yellow", "orange", "blue"];
let randomColor = Math.floor(Math.random() * color.length);
let colorItem = color[randomColor];
query(".pontos").innerHTML = pontos;

const draw = () => {
  currentShape.forEach((item) => {
    let itemShape = item + shapePosition;
    caixa[itemShape].classList.add(colorItem);
  });
};

draw();

const noDraw = () => {
  currentShape.forEach((item) => {
    let itemShape = item + shapePosition;
    caixa[itemShape].classList.remove(colorItem);
  });
};

const dowmShape = () => {
  freezer();

  noDraw();
  shapePosition += 10;
  draw();
};

setInterval(dowmShape, 500);

// ...

const freezer = () => {
  let isConnection = currentShape.some((item) => {
    let nextShape = item + shapePosition + widthShape;
    let isOutOfBounds = nextShape >= caixa.length;
    let frozen =
      caixa[nextShape] && caixa[nextShape].classList.contains("noGrid");

    return isOutOfBounds || frozen;
  });

  if (isConnection) {
    currentShape.forEach((item) => {
      let itemShape = item + shapePosition;
      caixa[itemShape].classList.add("noGrid");
    });

    shapePosition = 0;

    random = Math.floor(Math.random() * allShape.length);
    currentShape = allShape[random][shapeRotation];
    randomColor = Math.floor(Math.random() * color.length);
    colorItem = color[randomColor];

    draw();
  }

  checkAndClearLines();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    dowmShape();
  } else if (e.key === "ArrowRight") {
    right();
  } else if (e.key === "ArrowLeft") {
    left();
  } else if (e.key === 40) {
    rotation();
  }
});

const right = () => {
  let isEdgge = currentShape.some(
    (item) => (item + shapePosition) % widthShape === widthShape - 1
  );
  if (isEdgge) return;

  const isGrid = currentShape.some((item) => {
    return caixa[item + shapePosition + 1].classList.contains("noGrid");
  });

  if (isGrid) return;
  noDraw();
  shapePosition++;
  draw();
};

const left = () => {
  let isEdgge = currentShape.some(
    (item) => (item + shapePosition) % widthShape === 0
  );
  if (isEdgge) return;

  const isGrid = currentShape.some((item) => {
    return caixa[item + shapePosition - 1].classList.contains("noGrid");
  });

  if (isGrid) return;
  noDraw();
  shapePosition--;
  draw();
};

const finalizar = () => {
  location.reload();
};

const checkAndClearLines = () => {
  for (let i = row - 2; i > 0; i--) {
    // Começa da penúltima linha até a segunda linha
    const line = Array.from(tela.children).slice(i * col, (i + 1) * col);
    const isLineComplete = line.every((cell) =>
      cell.classList.contains("noGrid")
    );

    if (isLineComplete) {
      // Se a linha estiver completa, remova as classes "grid" e "noGrid"
      line.forEach((cell) => {
        cell.classList.remove("grid");
        cell.classList.remove("noGrid");
        query(".pontos").innerHTML = pontos += 100;
        let playAudio = new Audio("./src/assets/audio/som_explosao.mp3");
        playAudio.play();
      });

      // Mova todas as linhas acima para baixo
      for (let j = i * col - 1; j >= 0; j--) {
        const aboveCell = tela.children[j];
        const belowCell = tela.children[j + col];
        belowCell.className = aboveCell.className;
      }

      // Volte para a linha que acabou de ser removida
      i++;
    }
  }
};

const rotation = () => {
  noDraw();
  shapeRotation = (shapeRotation + 1) % currentShape.length;

  currentShape = allShape[random][shapeRotation];
  draw();
};

const gameOver = () => {
  // Exibe o elemento de Game Over
  const gameOverMessage = query(".game-over");
  gameOverMessage.style.display = "block";

  // Centraliza o elemento na tela
  gameOverMessage.style.position = "absolute";
  gameOverMessage.style.top = "50%";
  gameOverMessage.style.left = "50%";
  gameOverMessage.style.transform = "translate(-50%, -50%)";

  // Adiciona outros estilos desejados
  gameOverMessage.style.fontSize = "24px";
  gameOverMessage.style.color = "red";
};

query(".btn").addEventListener("click", finalizar);
query(".left").addEventListener("click", left);
query(".right").addEventListener("click", right);
query(".dowm").addEventListener("click", dowmShape);
query(".rotation").addEventListener("click", rotation);

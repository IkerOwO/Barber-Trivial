let timerInterval;
let timeLeft = 15;
// AÑADIR PREGUNTAS COMO ESTAN EN EL ARRAY
const questions = [
      {
        question: "¿Qué herramienta se usa para hacer un degradado?",
        options: ["Tijeras", "Navaja", "Máquina con palanca", "Secador"],
        answer: "Máquina con palanca"
      },
      {
        question: "¿Qué debe hacerse antes de usar una navaja en un cliente?",
        options: ["Limpiarla con agua", "Esterilizarla o usar una nueva", "Nada", "Ponerle aceite"],
        answer: "Esterilizarla o usar una nueva"
      },
      {
        question: "¿Cuál es el tiempo máximo recomendado para dejar un producto de decoloración?",
        options: ["10 min", "30 min", "60 min", "90 min"],
        answer: "60 min"
      },
      {
        question: "¿Cómo se llama el peine que ayuda a hacer cortes precisos con máquina?",
        options: ["Peine flattop", "Peine afro", "Peine redondo", "Peine térmico"],
        answer: "Peine flattop"
      },
      {
        question: "¿Qué color se usa para matizar tonos amarillos?",
        options: ["Rojo", "Violeta", "Azul", "Verde"],
        answer: "Violeta"
      }

    ];

    let players = [];
    let currentPlayer = 0;
    const usedQuestions = new Set();
    const boardSize = 25;

    const playersForm = document.getElementById("playersForm");
    const numPlayersInput = document.getElementById("numPlayers");

    numPlayersInput.addEventListener("change", () => {
      playersForm.innerHTML = "";
      const num = parseInt(numPlayersInput.value);
      for (let i = 0; i < num; i++) {
        const input = document.createElement("input");
        input.placeholder = `Nombre del jugador ${i + 1}`;
        input.required = true;
        playersForm.appendChild(input);
      }
    });

    // Carga inputs al inicio
    numPlayersInput.dispatchEvent(new Event("change"));

    function startGame() {
      const inputs = playersForm.querySelectorAll("input");
      players = [];
      inputs.forEach(input => {
        const name = input.value.trim() || "Jugador";
        players.push({ name, score: 0 });
      });

      document.getElementById("setup").style.display = "none";
      document.getElementById("gameContainer").style.display = "block";

      renderBoard();
      updateScoreboard();
      updateTurn();
    }

    function renderBoard() {
      const board = document.getElementById("board");
      board.innerHTML = "";
      for (let i = 0; i < boardSize; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = i + 1;
        tile.onclick = () => openTile(tile);
        board.appendChild(tile);
      }
    }

    function updateTurn() {
      document.getElementById("currentPlayerName").textContent = players[currentPlayer].name;
    }

    function updateScoreboard() {
      const scoreboard = document.getElementById("scoreboard");
      scoreboard.innerHTML = "<h3>Marcador</h3>";
      players.forEach(p => {
        const line = document.createElement("div");
        line.textContent = `${p.name}: ${p.score} pts`;
        scoreboard.appendChild(line);
      });
    }

    function getRandomQuestion() {
      if (usedQuestions.size >= questions.length) return null;
      let index;
      do {
        index = Math.floor(Math.random() * questions.length);
      } while (usedQuestions.has(index));
      usedQuestions.add(index);
      return questions[index];
    }

    function openTile(tile) {
      const question = getRandomQuestion();
      if (!question) {
        alert("¡Ya no hay más preguntas!");
        return;
      }

      tile.classList.add("used");

      const modal = document.getElementById("questionModal");
      const questionText = document.getElementById("questionText");
      const answersDiv = document.getElementById("answers");

      questionText.textContent = question.question;
      answersDiv.innerHTML = "";

      question.options.forEach(option => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = option;
        btn.onclick = () => {
          if (option === question.answer) {
            alert("¡Correcto!");
            players[currentPlayer].score += 10;
          } else {
            alert("Incorrecto 😬");
          }
          updateScoreboard();
          currentPlayer = (currentPlayer + 1) % players.length;
          updateTurn();
          closeModal();
        };
        answersDiv.appendChild(btn);
      });

      modal.style.display = "flex";
      startTimer();
    }
function startTimer() {
  timeLeft = 15;
  const timerDiv = document.getElementById("timer");
  timerDiv.textContent = `⏳ Tiempo restante: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDiv.textContent = `⏳ Tiempo restante: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("⏰ ¡Tiempo agotado!");
      currentPlayer = (currentPlayer + 1) % players.length;
      updateTurn();
      closeModal();
    }
  }, 1000);
}

function closeModal() {
  clearInterval(timerInterval);
  document.getElementById("questionModal").style.display = "none";

}

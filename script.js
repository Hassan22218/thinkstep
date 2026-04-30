let currentQ = 0;
let hintIndex = 0;

function loadQuestion() {
  document.getElementById("question-box").innerText = questions[currentQ].question;
}

function showHint() {
  const q = questions[currentQ];
  if (hintIndex < q.hints.length) {
    document.getElementById("output").innerText = "Hint: " + q.hints[hintIndex];
    hintIndex++;
  } else {
    document.getElementById("output").innerText = "No more hints";
  }
}

function showTrap() {
  document.getElementById("output").innerText = "Mistake Trap: " + questions[currentQ].trap;
}

function showSolution() {
  document.getElementById("output").innerText =
    "Solution:\n" + questions[currentQ].solution.join("\n");
}

loadQuestion();
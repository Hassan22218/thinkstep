let currentQ = 0;
let hintIndex = 0;
let score = 0;

function loadQuestion() {
  document.getElementById("question-box").innerText =
    questions[currentQ].question;

  document.getElementById("output").innerText = "";
}

loadQuestion();

function checkAnswer() {
  let userAns = document.getElementById("answer").value;

  if (userAns === questions[currentQ].answer) {
    score++;
    document.getElementById("output").innerText = "Correct ✔️ Good thinking!";
    document.getElementById("score").innerText = "Score: " + score;

    nextQuestion();
  } else {
    document.getElementById("output").innerText =
      "Wrong ❌ Think again or use hint";
  }
}

function showHint() {
  let q = questions[currentQ];

  if (hintIndex < q.hints.length) {
    document.getElementById("output").innerText =
      "Hint: " + q.hints[hintIndex];
    hintIndex++;
  } else {
    document.getElementById("output").innerText = "No more hints";
  }
}

function showTrap() {
  document.getElementById("output").innerText =
    "Mistake Trap: " + questions[currentQ].trap;
}

function showSolution() {
  document.getElementById("output").innerText =
    "Solution:\n" + questions[currentQ].solution.join("\n");
}

function nextQuestion() {
  currentQ++;
  hintIndex = 0;

  if (currentQ < questions.length) {
    loadQuestion();
    document.getElementById("answer").value = "";
  } else {
    document.getElementById("question-box").innerText =
      "All questions completed 🎉";
  }
}
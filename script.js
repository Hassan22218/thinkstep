let currentQ = 0;
let hintIndex = 0;
let score = 0;

let startTime = Date.now();
let analytics = JSON.parse(localStorage.getItem("analytics")) || [];

function loadQuestion() {
  document.getElementById("question-box").innerText =
    questions[currentQ].question;

  document.getElementById("output").innerText = "";
  document.getElementById("answer").value = "";

  hintIndex = 0;
  startTime = Date.now();
}

loadQuestion();

function checkAnswer() {
  let userAns = document.getElementById("answer").value;
  let correctAns = questions[currentQ].answer;

  let timeSpent = Math.floor((Date.now() - startTime) / 1000);

  analytics.push({
    question: questions[currentQ].question,
    userAnswer: userAns,
    correct: userAns === correctAns,
    hintsUsed: hintIndex,
    timeSpent: timeSpent,
    mistakeType: getMistakeType(userAns, correctAns)
  });

  localStorage.setItem("analytics", JSON.stringify(analytics));

  if (userAns === correctAns) {
    score++;
    document.getElementById("output").innerText = "Correct ✔️";
    document.getElementById("score").innerText = "Score: " + score;
    nextQuestion();
  } else {
    document.getElementById("output").innerText = "Wrong ❌ Think again";
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
    "Mistake: " + questions[currentQ].trap;
}

function showSolution() {
  document.getElementById("output").innerText =
    "Solution:\n" + questions[currentQ].solution.join("\n");
}

function nextQuestion() {
  currentQ++;

  if (currentQ < questions.length) {
    loadQuestion();
  } else {
    document.getElementById("question-box").innerText =
      "Completed 🎉 Check Analytics";
  }
}

function getMistakeType(userAns, correctAns) {
  if (userAns === "") return "no_attempt";
  if (isNaN(userAns)) return "concept_confusion";
  return "calculation_error";
}
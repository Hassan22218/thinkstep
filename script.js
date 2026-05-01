// =============================
// GLOBAL STATE
// =============================
let currentQ = 0;
let hintIndex = 0;
let score = 0;

let startTime = Date.now();

// local backup (optional)
let analytics = JSON.parse(localStorage.getItem("analytics")) || [];

// =============================
// LOAD QUESTION
// =============================
function loadQuestion() {
  document.getElementById("question-box").innerText =
    questions[currentQ].question;

  document.getElementById("output").innerText = "";
  document.getElementById("answer").value = "";

  hintIndex = 0;
  startTime = Date.now();
}

loadQuestion();

// =============================
// SAVE TO FIREBASE
// =============================
function saveAttemptToFirebase(data) {
  if (typeof db === "undefined") {
    console.error("db not defined ❌");
    alert("Firebase not connected");
    return;
  }

  db.collection("attempts").add(data)
    .then(() => {
      console.log("Saved to Firebase ✅");
    })
    .catch((error) => {
      console.error("Firebase error:", error);
    });
}

// =============================
// CHECK ANSWER
// =============================
function checkAnswer() {
  let userAns = document.getElementById("answer").value.trim();
  let correctAns = questions[currentQ].answer;

  let timeSpent = Math.floor((Date.now() - startTime) / 1000);

  let attemptData = {
    question: questions[currentQ].question,
    userAnswer: userAns,
    correct: userAns === correctAns,
    hintsUsed: hintIndex,
    timeSpent: timeSpent,
    mistakeType: getMistakeType(userAns, correctAns),
    timestamp: Date.now()
  };

  // 🔥 SEND TO FIREBASE
  saveAttemptToFirebase(attemptData);

  // local backup
  analytics.push(attemptData);
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

// =============================
// HINT
// =============================
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

// =============================
// TRAP
// =============================
function showTrap() {
  document.getElementById("output").innerText =
    "Mistake: " + questions[currentQ].trap;
}

// =============================
// SOLUTION
// =============================
function showSolution() {
  document.getElementById("output").innerText =
    "Solution:\n" + questions[currentQ].solution.join("\n");
}

// =============================
// NEXT QUESTION
// =============================
function nextQuestion() {
  currentQ++;

  if (currentQ < questions.length) {
    loadQuestion();
  } else {
    document.getElementById("question-box").innerText =
      "Completed 🎉 Check Analytics";
  }
}

// =============================
// MISTAKE TYPE
// =============================
function getMistakeType(userAns, correctAns) {
  if (userAns === "") return "no_attempt";
  if (isNaN(userAns)) return "concept_confusion";
  return "calculation_error";
}

// =============================
// TEST FIREBASE BUTTON
// =============================
function testFirebase() {
  if (typeof db === "undefined") {
    alert("Firebase not initialized ❌");
    return;
  }

  db.collection("test").add({
    message: "ThinkStep working",
    time: Date.now()
  })
  .then(() => {
    alert("Firebase working ✅");
  })
  .catch((error) => {
    console.error(error);
    alert("Error ❌");
  });
}
let currentQ = 0;
let hintIndex = 0;
let score = 0;
let startTime = Date.now();

let currentStudent = null;

// ---------------- AUTH ----------------

function loginStudent() {
  let name = document.getElementById("studentName").value.trim();
  let studentClass = document.getElementById("studentClass").value.trim();

  if (!name || !studentClass) {
    alert("Fill all fields");
    return;
  }

  db.collection("students")
    .where("name", "==", name)
    .where("class", "==", studentClass)
    .get()
    .then((snap) => {

      if (!snap.empty) {
        currentStudent = snap.docs[0].id;
        alert("Welcome back ✔");
      } else {
        currentStudent = "stu_" + Date.now();

        db.collection("students").doc(currentStudent).set({
          name: name,
          class: studentClass,
          joinedAt: Date.now()
        });

        alert("New student registered ✔");
      }

      localStorage.setItem("studentId", currentStudent);
      startApp();
    });
}

// AUTO LOGIN WITH VALIDATION
window.onload = function () {
  let saved = localStorage.getItem("studentId");

  if (saved) {
    db.collection("students").doc(saved).get().then(doc => {
      if (doc.exists) {
        currentStudent = saved;
        startApp();
      } else {
        localStorage.removeItem("studentId");
      }
    });
  }
};

function startApp() {
  document.getElementById("authBox").style.display = "none";
  document.getElementById("quizBox").style.display = "block";
  loadQuestion();
}

// ---------------- QUIZ ----------------

function loadQuestion() {
  document.getElementById("question-box").innerText =
    questions[currentQ].question;

  document.getElementById("answer").value = "";
  document.getElementById("output").innerText = "";

  hintIndex = 0;
  startTime = Date.now();
}

function checkAnswer() {
  if (!currentStudent) {
    alert("Login required");
    return;
  }

  let userAns = document.getElementById("answer").value.trim();
  let correct = questions[currentQ].answer;

  let timeSpent = Math.floor((Date.now() - startTime) / 1000);

  db.collection("attempts").add({
    studentId: currentStudent,
    question: questions[currentQ].question,
    userAnswer: userAns,
    correct: userAns === correct,
    hintsUsed: hintIndex,
    timeSpent: timeSpent,
    timestamp: Date.now()
  });

  if (userAns === correct) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    nextQuestion();
  } else {
    document.getElementById("output").innerText = "Wrong ❌";
  }
}

function nextQuestion() {
  currentQ++;
  if (currentQ < questions.length) {
    loadQuestion();
  } else {
    document.getElementById("question-box").innerText = "Completed 🎉";
  }
}

// ---------------- HELPERS ----------------

function showHint() {
  let q = questions[currentQ];
  if (hintIndex < q.hints.length) {
    alert(q.hints[hintIndex]);
    hintIndex++;
  }
}

function showTrap() {
  alert(questions[currentQ].trap);
}

function showSolution() {
  alert(questions[currentQ].solution.join("\n"));
}

function logout() {
  localStorage.removeItem("studentId");
  location.reload();
}

// ---------------- FIREBASE TEST ----------------

function testFirebase() {
  db.collection("test").add({
    message: "ThinkStep working",
    time: Date.now()
  })
  .then(() => alert("Firebase OK ✔"))
  .catch(() => alert("Firebase Error ❌"));
}
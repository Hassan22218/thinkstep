let currentQ = 0;
let hintIndex = 0;
let score = 0;

let startTime = Date.now();
let analytics = JSON.parse(localStorage.getItem("analytics")) || [];

let currentStudentId = null;

// 🔵 REGISTER STUDENT
function registerStudent() {
let name = document.getElementById("studentName").value.trim();
let studentClass = document.getElementById("studentClass").value.trim();

if (!name || !studentClass) {
alert("Fill all fields");
return;
}

let id = "stu_" + Date.now();

db.collection("students").doc(id).set({
name: name,
class: studentClass,
joinedAt: Date.now()
});

currentStudentId = id;

alert("Registered ✔ Now start solving");
}

// 🔵 LOAD QUESTION
function loadQuestion() {
document.getElementById("question-box").innerText =
questions[currentQ].question;

document.getElementById("output").innerText = "";
document.getElementById("answer").value = "";

hintIndex = 0;
startTime = Date.now();
}

loadQuestion();

// 🔵 CHECK ANSWER
function checkAnswer() {

if (!currentStudentId) {
alert("Please register first");
return;
}

let userAns = document.getElementById("answer").value.trim();
let correctAns = questions[currentQ].answer;

let timeSpent = Math.floor((Date.now() - startTime) / 1000);

// save locally (analytics page)
analytics.push({
question: questions[currentQ].question,
userAnswer: userAns,
correct: userAns === correctAns,
hintsUsed: hintIndex,
timeSpent: timeSpent,
mistakeType: getMistakeType(userAns, correctAns)
});

localStorage.setItem("analytics", JSON.stringify(analytics));

// 🔥 SAVE TO FIREBASE
db.collection("attempts").add({
studentId: currentStudentId,
question: questions[currentQ].question,
userAnswer: userAns,
correct: userAns === correctAns,
hintsUsed: hintIndex,
timeSpent: timeSpent,
mistakeType: getMistakeType(userAns, correctAns),
timestamp: Date.now()
});

// UI RESPONSE
if (userAns === correctAns) {
score++;
document.getElementById("output").innerText = "Correct ✔️";
document.getElementById("score").innerText = "Score: " + score;
nextQuestion();
} else {
document.getElementById("output").innerText = "Wrong ❌ Think again";
}
}

// 🔵 HINT
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

// 🔵 TRAP
function showTrap() {
document.getElementById("output").innerText =
"Mistake: " + questions[currentQ].trap;
}

// 🔵 SOLUTION
function showSolution() {
document.getElementById("output").innerText =
"Solution:\n" + questions[currentQ].solution.join("\n");
}

// 🔵 NEXT QUESTION
function nextQuestion() {
currentQ++;

if (currentQ < questions.length) {
loadQuestion();
} else {
document.getElementById("question-box").innerText =
"Completed 🎉 Check Analytics";
}
}

// 🔵 MISTAKE TYPE
function getMistakeType(userAns, correctAns) {
if (userAns === "") return "no_attempt";
if (isNaN(userAns)) return "concept_confusion";
return "calculation_error";
}

// 🔵 TEST FIREBASE
function testFirebase() {
db.collection("test").add({
message: "ThinkStep working",
time: Date.now()
});

alert("Firebase working ✔");
}

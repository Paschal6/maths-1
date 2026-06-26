/* ==========================================
   Math CBT Pro - FINAL STABLE VERSION
========================================== */

// ===============================
// Storage Layer
// ===============================
const StorageAPI = {
    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};

// ===============================
// State
// ===============================
let questions = [];
let examQuestions = [];

let currentQuestion = 0;
let answers = [];
let flaggedQuestions = [];

const totalQuestions = 30;

// ===============================
// DOM
// ===============================
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("options");
const palette = document.getElementById("palette");
const progressBar = document.getElementById("progressBar");

const studentName = document.getElementById("studentName");
const candidateNumber = document.getElementById("candidateNumber");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const flagBtn = document.getElementById("flagBtn");

const submitButton = document.getElementById("submitExam");
const submitModal = document.getElementById("submitModal");
const cancelSubmit = document.getElementById("cancelSubmit");
const confirmSubmit = document.getElementById("confirmSubmit");

// ===============================
// Student
// ===============================
function loadStudent() {
    const student = StorageAPI.get("student");

    if (!student) return;

    studentName.textContent = student.name || "";
    candidateNumber.textContent = student.candidate || "";
}

// ===============================
// Load Questions
// ===============================
async function loadQuestions() {
    try {
        const res = await fetch("maths.json");
        const data = await res.json();

        questions = Array.isArray(data.questions) ? data.questions : [];

        if (questions.length === 0) {
            throw new Error("No questions found");
        }

        initExam(); // IMPORTANT: unified startup

    } catch (err) {
        console.error("LOAD ERROR:", err);
        questionText.textContent = "Failed to load questions.";
    }
}

// ===============================
// Shuffle
// ===============================
function shuffle(arr) {
    const a = [...arr];

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

// ===============================
// Init Exam
// ===============================
function initExam() {

    examQuestions = shuffle(questions).slice(0, totalQuestions);

    answers = Array(totalQuestions).fill(null);
    flaggedQuestions = [];
    currentQuestion = 0;

    createPalette();
    restoreExam();
    displayQuestion();
    updateProgress();
}

// ===============================
// Display Question
// ===============================
function displayQuestion() {

    const q = examQuestions[currentQuestion];
    if (!q) return;

    questionText.textContent = `${currentQuestion + 1}. ${q.question}`;

    optionsContainer.innerHTML = "";

    q.options.forEach((opt, i) => {

        const label = document.createElement("label");
        label.className = "option";

        label.innerHTML = `
            <input type="radio"
                   name="option"
                   value="${i}"
                   ${answers[currentQuestion] === i ? "checked" : ""}>
            <span>${opt}</span>
        `;

        label.onclick = () => selectAnswer(i);

        optionsContainer.appendChild(label);
    });

    highlightPalette();
    updateTitle();
}

// ===============================
// Select Answer
// ===============================
function selectAnswer(i) {
    answers[currentQuestion] = i;

    displayQuestion();
    updateProgress();
    saveExam();
}

// ===============================
// Progress
// ===============================
function updateProgress() {

    const answered = answers.filter(a => a !== null).length;

    progressBar.style.width =
        (answered / totalQuestions) * 100 + "%";
}

// ===============================
// Save State
// ===============================
function saveExam() {
    StorageAPI.save("mathCBT", {
        answers,
        flaggedQuestions,
        currentQuestion
    });
}

// ===============================
// Restore State
// ===============================
function restoreExam() {

    const saved = StorageAPI.get("mathCBT");
    if (!saved) return;

    answers = saved.answers || answers;
    flaggedQuestions = saved.flaggedQuestions || [];
    currentQuestion = saved.currentQuestion || 0;
}

// ===============================
// Palette
// ===============================
function createPalette() {

    palette.innerHTML = "";

    for (let i = 0; i < totalQuestions; i++) {

        const btn = document.createElement("button");

        btn.textContent = i + 1;
        btn.className = "palette-btn";

        btn.onclick = () => {
            currentQuestion = i;
            displayQuestion();
        };

        palette.appendChild(btn);
    }
}

// ===============================
// Highlight Palette
// ===============================
function highlightPalette() {

    document.querySelectorAll(".palette-btn")
        .forEach((btn, i) => {

            btn.className = "palette-btn";

            if (i === currentQuestion) btn.classList.add("active");
            if (answers[i] !== null) btn.classList.add("answered");
            if (flaggedQuestions.includes(i)) btn.classList.add("flagged");
        });
}

// ===============================
// Navigation
// ===============================
prevBtn.onclick = () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
        saveExam();
    }
};

nextBtn.onclick = () => {
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        displayQuestion();
        saveExam();
    }
};

flagBtn.onclick = () => {

    const i = flaggedQuestions.indexOf(currentQuestion);

    if (i === -1) flaggedQuestions.push(currentQuestion);
    else flaggedQuestions.splice(i, 1);

    highlightPalette();
    saveExam();
};

// ===============================
// Title
// ===============================
function updateTitle() {
    document.title = `Question ${currentQuestion + 1} of ${totalQuestions}`;
}

// ===============================
// Score (FIXED)
// ===============================
function calculateScore() {

    let score = 0;

    examQuestions.forEach((q, i) => {

        const userIndex = answers[i];

        if (userIndex === null || userIndex === undefined) return;

        if (q.options[userIndex] === q.answer) {
            score++;
        }
    });

    return score;
}

// ===============================
// Grade
// ===============================
function calculateGrade(p) {

    if (p >= 80) return "A";
    if (p >= 70) return "B";
    if (p >= 60) return "C";
    if (p >= 50) return "D";
    if (p >= 40) return "E";

    return "F";
}

// ===============================
// Build Review
// ===============================
function buildReview() {

    return examQuestions.map((q, i) => ({

        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        userAnswer: answers[i],
        isCorrect: answers[i] !== null &&
                   q.options[answers[i]] === q.answer,

        flagged: flaggedQuestions.includes(i)
    }));
}

// ===============================
// Finish Exam
// ===============================
function finishExam() {

    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);

    const result = {
        student: StorageAPI.get("student"),
        score,
        total: totalQuestions,
        percentage,
        grade: calculateGrade(percentage),
        review: buildReview(),
        submittedAt: new Date().toISOString()
    };

    StorageAPI.save("mathResult", result);
    StorageAPI.remove("mathCBT");

    window.location.href = "result.html";
}

// ===============================
// Submit Modal
// ===============================
submitButton.onclick = () => submitModal.classList.remove("hidden");
cancelSubmit.onclick = () => submitModal.classList.add("hidden");
confirmSubmit.onclick = finishExam;

// ===============================
// Init Start (CRITICAL FIX)
// ===============================
loadStudent();
loadQuestions();

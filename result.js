/* ===========================
   Result Page - FIXED
=========================== */

const StorageAPI = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    }
};

// ---------------------------
// DOM
// ---------------------------
const nameEl = document.getElementById("candidateName");
const numberEl = document.getElementById("candidateNumber");
const scoreEl = document.getElementById("score");
const percentageEl = document.getElementById("percentage");
const gradeEl = document.getElementById("grade");
const reviewContainer = document.getElementById("reviewContainer");

// ---------------------------
// Load Result
// ---------------------------
function loadResult() {

    const result = StorageAPI.get("mathResult");

    if (!result) {
        document.body.innerHTML =
            "<h2>No result found. Please retake exam.</h2>";
        return;
    }

    const student = result.student || {};

    nameEl.textContent = student.name || "Unknown Student";
    numberEl.textContent = student.candidate || "";

    scoreEl.textContent = `${result.score} / ${result.total}`;
    percentageEl.textContent = `${result.percentage}%`;
    gradeEl.textContent = result.grade || "N/A";

    renderReview(result.review || []);
}

// ---------------------------
// Render Review
// ---------------------------
function renderReview(review) {

    reviewContainer.innerHTML = "";

    review.forEach((q, i) => {

        const div = document.createElement("div");
        div.className = "review-item";

        const status = q.isCorrect ? "correct" : "wrong";

        div.innerHTML = `
            <h4>${i + 1}. ${q.question}</h4>
            <p>Your Answer: ${q.options[q.userAnswer] ?? "Not answered"}</p>
            <p>Correct Answer: ${q.correctAnswer}</p>
            <p class="${status}">
                ${q.isCorrect ? "Correct" : "Wrong"}
            </p>
        `;

        reviewContainer.appendChild(div);
    });
}

// ---------------------------
// Buttons
// ---------------------------
document.getElementById("restartBtn").onclick = () => {
    window.location.href = "index.html";
};

document.getElementById("printBtn").onclick = () => {
    window.print();
};

// ---------------------------
// Init
// ---------------------------
loadResult();

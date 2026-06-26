/* ==========================================
   Math CBT Pro
   exam.js
   Part 1 - Exam Initialization
========================================== */

// -------------------------------
// Global Variables
// -------------------------------
let StorageAPI = Storage;
let questions = [];
let examQuestions = [];

let currentQuestion = 0;

let answers = [];

let flaggedQuestions = [];

let totalQuestions = 30;

// -------------------------------
// DOM Elements
// -------------------------------

const questionText =
document.getElementById("questionText");

const optionsContainer =
document.getElementById("options");

const palette =
document.getElementById("palette");

const progressBar =
document.getElementById("progressBar");

const studentName =
document.getElementById("studentName");

const candidateNumber =
document.getElementById("candidateNumber");

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

const flagBtn =
document.getElementById("flagBtn");

// -------------------------------
// Load Student Information
// -------------------------------

function loadStudent(){

const student =
JSON.parse(
localStorage.getItem("student")
);

if(student){

studentName.textContent =
student.name;

candidateNumber.textContent =
student.candidate;

}

}

// -------------------------------
// Load Question Bank
// -------------------------------

async function loadQuestions(){

    console.log("Loading questions...");

    try{

        const response =
        await fetch("maths.json");

        const data = await response.json();

        console.log("RAW DATA:", data);

        questions = data.questions; // IMPORTANT LINE

        if(!Array.isArray(questions)){
            throw new Error("questions is not an array");
        }

        console.log("QUESTIONS LOADED:", questions.length);

        prepareExam();

    }
    catch(error){

        console.error("LOAD ERROR:", error);

        questionText.innerHTML =
        "Failed to load questions. Check console.";

    }
}

// -------------------------------
// Shuffle Array
// -------------------------------

function shuffle(array){

for(

let i=array.length-1;

i>0;

i--

){

const j =
Math.floor(
Math.random()*(i+1)
);

[array[i],array[j]]=
[array[j],array[i]];

}

return array;

}

// -------------------------------
// Prepare Examination
// -------------------------------

function prepareExam(){

examQuestions =
shuffle([...questions])
.slice(0,totalQuestions);

answers =
new Array(totalQuestions)
.fill(null);

createPalette();

displayQuestion();

updateProgress();

console.log("ALL QUESTIONS:", questions.length);

console.log("EXAM QUESTIONS:", examQuestions);

}

// -------------------------------
// Display Current Question
// -------------------------------

function displayQuestion(){

const question =
examQuestions[currentQuestion];

questionText.innerHTML =

`${currentQuestion+1}.
${question.question}`;

optionsContainer.innerHTML="";

question.options.forEach(

(option,index)=>{

const optionDiv =
document.createElement("label");

optionDiv.className="option";

optionDiv.innerHTML=`

<input

type="radio"

name="option"

value="${index}"

${
answers[currentQuestion]
===index

?

"checked"

:

""

}

>

<span>

${option}

</span>

`;

optionDiv.onclick=()=>{

selectAnswer(index);

};

optionsContainer.appendChild(
optionDiv
);

}

);

highlightPalette();

}

// -------------------------------
// Select Answer
// -------------------------------

function selectAnswer(index){

answers[currentQuestion]=index;

displayQuestion();

updateProgress();

saveExam();

}

// -------------------------------
// Update Progress Bar
// -------------------------------

function updateProgress(){

const answered =
answers.filter(

item=>item!==null

).length;

const percentage =

(answered/
totalQuestions)

*100;

progressBar.style.width=

percentage+"%";

}

// -------------------------------
// Save Progress
// -------------------------------

function saveExam() {

    StorageAPI.save("mathCBT", {
        answers,
        flaggedQuestions,
        currentQuestion
    });
}

// -------------------------------
// Create Palette
// -------------------------------

function createPalette(){

palette.innerHTML="";

for(

let i=0;

i<totalQuestions;

i++

){

const btn =
document.createElement("button");

btn.className="palette-btn";

btn.textContent=i+1;

btn.onclick=()=>{

currentQuestion=i;

displayQuestion();

};

palette.appendChild(btn);

}

}

// -------------------------------
// Highlight Palette
// -------------------------------

function highlightPalette(){

const buttons =

document.querySelectorAll(

".palette-btn"

);

buttons.forEach(

(button,index)=>{

button.className="palette-btn";

if(index===currentQuestion){

button.classList.add(

"active"

);

}

if(

answers[index]!==null

){

button.classList.add(

"answered"

);

}

if(

flaggedQuestions.includes(index)

){

button.classList.add(

"flagged"

);

}

}

);

}

// -------------------------------
// Initialize Exam
// -------------------------------

loadStudent();

loadQuestions();

startTimer(() => {
    finishExam(); // auto-submit when time ends
});

/* ==========================================
   Part 2 - Navigation & State Management
========================================== */

// -------------------------------
// Previous Question
// -------------------------------

prevBtn.addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        displayQuestion();

        saveExam();

    }

});

// -------------------------------
// Next Question
// -------------------------------

nextBtn.addEventListener("click", () => {

    if (currentQuestion < totalQuestions - 1) {

        currentQuestion++;

        displayQuestion();

        saveExam();

    }

});

// -------------------------------
// Flag Question
// -------------------------------

flagBtn.addEventListener("click", () => {

    const index = flaggedQuestions.indexOf(currentQuestion);

    if (index === -1) {

        flaggedQuestions.push(currentQuestion);

    } else {

        flaggedQuestions.splice(index, 1);

    }

    highlightPalette();

    saveExam();

});

// -------------------------------
// Restore Saved Exam
// -------------------------------

function restoreExam() {

    const saved = StorageAPI.get("mathCBT");

    if (!saved) return;

    answers = saved.answers || answers;
    flaggedQuestions = saved.flaggedQuestions || [];
    currentQuestion = saved.currentQuestion || 0;

    displayQuestion();
    updateProgress();
}

setTimeout(restoreExam, 300);

// -------------------------------
// Keyboard Navigation
// -------------------------------

document.addEventListener("keydown", e => {

    switch (e.key) {

        case "ArrowRight":

            if (currentQuestion < totalQuestions - 1) {

                currentQuestion++;

                displayQuestion();

                saveExam();

            }

            break;

        case "ArrowLeft":

            if (currentQuestion > 0) {

                currentQuestion--;

                displayQuestion();

                saveExam();

            }

            break;

        case "f":

        case "F":

            flagBtn.click();

            break;

    }

});

// -------------------------------
// Number Keys (1–4)
// -------------------------------

document.addEventListener("keydown", e => {

    if (["1","2","3","4"].includes(e.key)) {

        const answer = Number(e.key) - 1;

        selectAnswer(answer);

    }

});

// -------------------------------
// Jump to Question
// -------------------------------

function gotoQuestion(index){

    if(index<0)return;

    if(index>=totalQuestions)return;

    currentQuestion=index;

    displayQuestion();

    saveExam();

}

// -------------------------------
// Unanswered Counter
// -------------------------------

function unansweredCount(){

    return answers.filter(

        a => a === null

    ).length;

}

// -------------------------------
// Completion Percentage
// -------------------------------

function completionPercentage(){

    return Math.round(

        (

            (totalQuestions -

            unansweredCount())

            / totalQuestions

        ) * 100

    );

}

// -------------------------------
// Update Browser Title
// -------------------------------

function updateTitle(){

    document.title =

    `Question ${currentQuestion+1} of ${totalQuestions}`;

}

const originalDisplayQuestion = displayQuestion;

displayQuestion = function(){

    originalDisplayQuestion();

    updateTitle();

};

// -------------------------------
// Warn Before Closing
// -------------------------------

window.addEventListener(
    "beforeunload",
    beforeUnloadHandler
);

examQuestions = shuffle(
    questions.map((q, index) => ({
        ...q,
        id: index
    }))
).slice(0, totalQuestions);

startTimer(() => {
    finishExam(); // auto-submit when time ends
});

/* ==========================================
   Part 3 - Submission & Results
========================================== */

const submitButton =
document.getElementById("submitExam");

const submitModal =
document.getElementById("submitModal");

const cancelSubmit =
document.getElementById("cancelSubmit");

const confirmSubmit =
document.getElementById("confirmSubmit");

// -------------------------------
// Open Submit Modal
// -------------------------------

submitButton.addEventListener("click", () => {

    submitModal.classList.remove("hidden");

});

// -------------------------------
// Cancel
// -------------------------------

cancelSubmit.addEventListener("click", () => {

    submitModal.classList.add("hidden");

});

// -------------------------------
// Confirm Submission
// -------------------------------

confirmSubmit.addEventListener("click", () => {

    finishExam();

});

// -------------------------------
// Calculate Score
// -------------------------------

function calculateScore(){

    let score = 0;

    examQuestions.forEach((question,index)=>{

        if(

            answers[index] === question.answer

        ){

            score++;

        }

    });

    return score;

}

// -------------------------------
// Grade
// -------------------------------

function calculateGrade(percent){

    if(percent>=80) return "A";

    if(percent>=70) return "B";

    if(percent>=60) return "C";

    if(percent>=50) return "D";

    if(percent>=40) return "E";

    return "F";

}

// -------------------------------
// Build Review Data
// -------------------------------

function buildReview(){

    return examQuestions.map((question,index)=>({

        id:question.id,

        question:question.question,

        options:question.options,

        correctAnswer:question.answer,

        userAnswer:answers[index],

        isCorrect:

            answers[index]===question.answer,

        flagged:

            flaggedQuestions.includes(index)

    }));

}

// -------------------------------
// Finish Exam
// -------------------------------

function finishExam() {

    stopTimer();

    const score = calculateScore();

    const percentage = Math.round((score / totalQuestions) * 100);

    const results = {
        student: StorageAPI.get("student"),
        score,
        total: totalQuestions,
        percentage,
        grade: calculateGrade(percentage),
        review: buildReview(),
        submittedAt: new Date().toISOString()
    };

    StorageAPI.save("mathResult", results);
    StorageAPI.remove("mathCBT");

    window.onbeforeunload = null;

    window.location.href = "result.html";
}

    const results = {

        student:

            JSON.parse(

                localStorage.getItem("student")

            ),

        score,

        total:totalQuestions,

        percentage,

        grade:

            calculateGrade(percentage),

        review:

            buildReview(),

        submittedAt:

            new Date().toISOString()

    };

    localStorage.setItem(

        "mathResult",

        JSON.stringify(results)

    );

    localStorage.removeItem("mathCBT");

    window.removeEventListener(

        "beforeunload",

        beforeUnloadHandler

    );

    window.location.href =

        "result.html";



// -------------------------------
// Before unload handler
// -------------------------------

function beforeUnloadHandler(e){

    e.preventDefault();

    e.returnValue = "";

}

window.addEventListener(

    "beforeunload",

    beforeUnloadHandler

);

startTimer(() => {
    finishExam(); // auto-submit when time ends
});
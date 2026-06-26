/* ==========================================
   Dashboard Logic
========================================== */

// Student Information
const student = JSON.parse(
localStorage.getItem("student")
);

if(!student){

window.location.href="login.html";

}

document.getElementById(
"studentName"
).textContent=student.name;

// Previous Result
const result = JSON.parse(
localStorage.getItem("mathResult")
);

if(result){

document.getElementById(
"completedCount"
).textContent="1";

document.getElementById(
"highestScore"
).textContent=
result.percentage+"%";

document.getElementById(
"historyBox"
).innerHTML=`

<strong>Date:</strong>

${new Date(
result.submittedAt
).toLocaleString()}

<br><br>

<strong>Score:</strong>

${result.score}/${result.total}

<br><br>

<strong>Grade:</strong>

${result.grade}

`;

}

// Start Exam
document.getElementById(
"startExam"
).onclick=function(){

window.location.href="exam.html";

};

// Logout
document.getElementById(
"logoutBtn"
).onclick=function(){

if(confirm(
"Logout from Math CBT Pro?"
)){

localStorage.removeItem(
"student"
);

window.location.href=
"login.html";

}

};

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("dashboardBtn").onclick = () => {
        window.location.href = "dashboard.html";
    };

    document.getElementById("mathBtn").onclick = () => {
        window.location.href = "exam.html";
    };

    document.getElementById("resultsBtn").onclick = () => {
        window.location.href = "result.html";
    };

    document.getElementById("settingsBtn").onclick = () => {
        alert("Settings coming soon");
    };

    document.getElementById("logoutBtn").onclick = () => {
        localStorage.clear();
        window.location.href = "login.html";
    };

});
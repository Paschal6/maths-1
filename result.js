const result =
JSON.parse(
localStorage.getItem("mathResult")
);

if(!result){

location.href="index.html";

}

document.getElementById("candidateName").textContent =
result.student.name;

document.getElementById("candidateNumber").textContent =
result.student.candidate;

document.getElementById("score").textContent =
`${result.score} / ${result.total}`;

document.getElementById("percentage").textContent =
result.percentage + "%";

document.getElementById("grade").textContent =
result.grade;

const review =
document.getElementById("reviewContainer");

result.review.forEach((item,index)=>{

const div =
document.createElement("div");

div.className="review-item";

div.innerHTML=`

<h3>

Question ${index+1}

</h3>

<p>

${item.question}

</p>

<p>

Your Answer:

<strong class="${
item.isCorrect
?
'correct'
:
'wrong'
}">

${
item.userAnswer===null
?
'Not Answered'
:
item.options[item.userAnswer]
}

</strong>

</p>

<p>

Correct Answer:

<strong>

${item.options[item.correctAnswer]}

</strong>

</p>

`;

review.appendChild(div);

});

document
.getElementById("printBtn")
.onclick=()=>{

window.print();

};

document
.getElementById("restartBtn")
.onclick=()=>{

localStorage.removeItem("mathResult");

location.href="dashboard.html";

};
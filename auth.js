const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e){

e.preventDefault();

const name =
document.getElementById("name").value;

const candidate =
document.getElementById("candidate").value;

const password =
document.getElementById("password").value;

if(name==="" || candidate==="" || password===""){

alert("Please complete the form.");

return;

}

const student={

name:name,

candidate:candidate

};

localStorage.setItem(

"student",

JSON.stringify(student)

);

window.location.href="dashboard.html";

});
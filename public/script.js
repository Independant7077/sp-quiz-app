let questions={

history:[
{
q:"Who discovered America?",
o:["Columbus","Newton","Einstein"],
a:0
},
{
q:"World War II ended in?",
o:["1945","1942","1950"],
a:0
}
],

science:[
{
q:"H2O is?",
o:["Water","Oxygen","Salt"],
a:0
},
{
q:"Earth revolves around?",
o:["Moon","Sun","Mars"],
a:1
}
]

}

function startQuiz(cat){

let name=document.getElementById("name").value
let email=document.getElementById("email").value

if(!name || !email){
alert("Enter name and email")
return
}

localStorage.setItem("name",name)
localStorage.setItem("email",email)
localStorage.setItem("category",cat)

window.location="quiz.html"

}

window.onload=function(){

if(!window.location.pathname.includes("quiz.html")) return

let cat=localStorage.getItem("category")
let quiz=questions[cat]

document.getElementById("category").innerText="Category: "+cat

let container=document.getElementById("quiz")

quiz.forEach((q,i)=>{

let html=`<p>${q.q}</p>`

q.o.forEach((opt,j)=>{

html+=`
<label>
<input type="radio" name="q${i}" value="${j}">
${opt}
</label><br>`

})

container.innerHTML+=html

})

}

function submitQuiz(){

let cat=localStorage.getItem("category")
let quiz=questions[cat]

let score=0

quiz.forEach((q,i)=>{

let ans=document.querySelector(`input[name="q${i}"]:checked`)

if(!ans) return

if(parseInt(ans.value)===q.a){

score+=2

}else{

score-=0.66

}

})

fetch("/submit",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
name:localStorage.getItem("name"),
email:localStorage.getItem("email"),
score:score
})

})

alert("Your score: "+score)

}
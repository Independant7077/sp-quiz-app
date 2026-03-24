let questions = {

history: [
{q:"Who discovered America?",o:["Columbus","Newton","Einstein","Darwin"],a:0,explanation:"Christopher Columbus discovered America in 1492."},
{q:"World War II ended in?",o:["1945","1942","1939","1950"],a:0,explanation:"WWII ended in 1945."},
{q:"First President of India?",o:["Nehru","Rajendra Prasad","Gandhi","Patel"],a:1},
{q:"Mughal Empire founded by?",o:["Akbar","Babur","Aurangzeb","Humayun"],a:1},
{q:"Independence year of India?",o:["1945","1947","1950","1930"],a:1},
{q:"French Revolution year?",o:["1789","1800","1750","1850"],a:0},
{q:"Who was Ashoka?",o:["King","Scientist","Poet","Doctor"],a:0},
{q:"Roman Empire capital?",o:["Paris","Rome","London","Berlin"],a:1},
{q:"Who wrote Arthashastra?",o:["Chanakya","Kalidasa","Valmiki","Tulsidas"],a:0},
{q:"Battle of Plassey year?",o:["1757","1857","1700","1800"],a:0}
],

science: [
{q:"H2O is?",o:["Water","Oxygen","Salt","Hydrogen"],a:0,explanation:"H2O is water made of hydrogen and oxygen."},
{q:"Earth revolves around?",o:["Moon","Sun","Mars","Venus"],a:1},
{q:"Speed of light?",o:["3x10^8","3x10^6","3x10^5","3x10^7"],a:0},
{q:"Human heart chambers?",o:["2","3","4","5"],a:2},
{q:"Gas used in balloons?",o:["Oxygen","Helium","Nitrogen","CO2"],a:1},
{q:"Largest planet?",o:["Earth","Mars","Jupiter","Saturn"],a:2},
{q:"Boiling point of water?",o:["90°C","100°C","80°C","70°C"],a:1},
{q:"Chemical symbol Na?",o:["Nitrogen","Sodium","Neon","Nickel"],a:1},
{q:"Sun is a?",o:["Planet","Star","Galaxy","Comet"],a:1},
{q:"DNA stands for?",o:["Deoxyribo Nucleic Acid","Data Network","Digital Array","None"],a:0}
],

geography: [
{q:"Capital of India?",o:["Delhi","Mumbai","Chennai","Kolkata"],a:0,explanation:"New Delhi is the capital of India."},
{q:"Largest ocean?",o:["Atlantic","Indian","Pacific","Arctic"],a:2},
{q:"Mount Everest height?",o:["8848m","8000m","7000m","9000m"],a:0},
{q:"Longest river?",o:["Ganga","Nile","Amazon","Yangtze"],a:1},
{q:"Sahara is?",o:["Forest","Desert","River","Mountain"],a:1},
{q:"Which continent India?",o:["Asia","Europe","Africa","Australia"],a:0},
{q:"Coldest place?",o:["Antarctica","Arctic","Siberia","Canada"],a:0},
{q:"Which country largest?",o:["USA","India","Russia","China"],a:2},
{q:"Tropic of Cancer passes through?",o:["India","USA","UK","China"],a:0},
{q:"Capital of Japan?",o:["Tokyo","Beijing","Seoul","Bangkok"],a:0}
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

if(window.location.pathname.includes("quiz.html")){

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

// ===== ADMIN FIX =====
if(window.location.pathname.includes("admin.html")){

let isAdmin = localStorage.getItem("admin")
let logoutBtn = document.getElementById("logoutBtn")

if(logoutBtn) logoutBtn.style.display = "none" // always hide first

if(isAdmin !== "true"){
window.location = "index.html"
return
}

if(logoutBtn) logoutBtn.style.display = "block"

fetch("/results")
.then(res=>res.json())
.then(data=>{

let table = document.getElementById("table")

data.forEach(row=>{

let tr = document.createElement("tr")

tr.innerHTML = `
<td>${row.id}</td>
<td>${row.name}</td>
<td>${row.email}</td>
<td>${row.score}</td>
<td>${row.date}</td>
`

table.appendChild(tr)

})

})

}

// ===== RESULT FIX =====
if(window.location.pathname.includes("result.html")){

let score = localStorage.getItem("latestScore")
document.getElementById("latestScore").innerText = score

let email = localStorage.getItem("email")

fetch(`/results/${email}`)
.then(res=>res.json())
.then(data=>{

let scores = []
let labels = []

let table = document.getElementById("historyTable")

data.forEach((row,index)=>{

scores.push(row.score)
labels.push("Attempt " + (data.length - index))

let tr = document.createElement("tr")
tr.innerHTML = `<td>${row.date}</td><td>${row.score}</td><td>${row.id}</td><td>${row.name}</td>`

table.appendChild(tr)

})

// SAFE CHART FIX
let chartEl = document.getElementById("scoreChart")

if(chartEl && typeof Chart !== "undefined"){

  console.log("Chart data:", scores)
new Chart(chartEl,{
type:"line",
data:{
labels:labels,
datasets:[{
label:"Score Trend",
data:scores
}]
}
})

}

})

// Answer Analysis
let analysisData = localStorage.getItem("analysis")

if(analysisData){

let analysis = JSON.parse(analysisData)
let div = document.getElementById("analysis")

analysis.forEach(a=>{

let block = document.createElement("div")

block.innerHTML = `
<p><b>${a.question}</b></p>
<p>Your Answer: ${a.selected}</p>
<p>Correct Answer: ${a.correct}</p>
<p style="color:${a.isCorrect ? "green":"red"}">
${a.isCorrect ? "Correct" : "Wrong"}
</p>
<p><b>Explanation:</b> ${a.explanation || "No explanation available"}</p>
<hr>
`

div.appendChild(block)

})

}

}

}

function submitQuiz(){

let cat = localStorage.getItem("category")
let quiz = questions[cat]

let score = 0
let analysis = []

quiz.forEach((q,i)=>{

let ans = document.querySelector(`input[name="q${i}"]:checked`)
let selected = ans ? parseInt(ans.value) : null

let correct = (selected === q.a)

if(correct){
score += 2
}else{
score -= 0.66
}

analysis.push({
question: q.q,
selected: selected !== null ? q.o[selected] : "Not Attempted",
correct: q.o[q.a],
isCorrect: correct,
explanation: q.explanation ? q.explanation : "Explanation not provided"
})

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

localStorage.setItem("latestScore",score)
localStorage.setItem("analysis",JSON.stringify(analysis))

window.location="result.html"
}

// ===== ADMIN LOGIN =====
function adminLogin(){

let userEl = document.getElementById("adminUser")
let passEl = document.getElementById("adminPass")

if(!userEl || !passEl){
  alert("Admin input fields not found")
  return
}

let user = userEl.value.trim()
let pass = passEl.value.trim()

console.log("Admin login attempt:", user, pass)   // DEBUG

if(user==="admin" && pass==="admin123"){
localStorage.setItem("admin","true")
window.location="admin.html"
}else{
alert("Invalid credentials")
}
}

// ===== LOGOUT =====
function logout(){
localStorage.removeItem("admin")
window.location="index.html"
}

// ===== HOME =====
function goHome(){
window.location="index.html"
}
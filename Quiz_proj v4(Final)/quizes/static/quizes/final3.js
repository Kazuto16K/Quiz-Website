//JS CODE FOR FETCHING AND ARRANGING DATA
let questions = null;

var selectedCategory="Football";

var form=document.getElementById("nameForm");
form.style.display="none";


function handleStartButtonClick(data){
    var result = window.confirm("START QUIZ "+data+" ?");
    if(result == false){
        event.preventDefault();
    }
    else{
        localStorage.setItem('myData',data);
        return true;
    }
}

var data = localStorage.getItem('myData');
selectedCategory=data;


async function gettingDATA(){
    try{
        
        const response = await fetch('/api-quiz/');
        const data = await response.json();
        
        
        //var type = handleStartButtonClick(selectedCategory);
        var type = selectedCategory;
        questions = manageData(data.data,type);
        //console.log(questions);
        startQuiz();
        //return questions;
    }catch(error){
        console.error(error);
    }
}    



  

function manageData(data,type){
    var filteredData = data.filter(item => item.quiz === type);
    filteredData = shuffleJSON(filteredData);
    var res = questionManager(filteredData);
    return res;    
}

function shuffleJSON(jsonArray) {
    
    var array = jsonArray.slice();
    
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    
    var shuffledJSON = JSON.parse(JSON.stringify(array));
    
    return shuffledJSON;
  }

function questionManager(data){
   var indexes = getRandomNumbers(10,data.length);
   console.log(indexes);
   var questionSET=[];
   for(let i=0;i<=indexes.length;i++){
       var questionData =  data[indexes[i]];
       if(questionData && questionData.text && questionData.answers){
        var myObject = {
            question : questionData.text || "",
            answer : questionData.answers || [],
          };
          questionSET.push(myObject);
       }
       
   }
   return questionSET;
}

function getRandomNumbers(quantity, range) {
    var numbers = [];
    
    for (var i = 0; i < range; i++) {
      numbers.push(i);
    }
    
    var randomNumbers = [];
    
    for (var j = 0; j < quantity; j++) {
      var randomIndex = Math.floor(Math.random() * numbers.length);
      var randomNumber = numbers[randomIndex];
      randomNumbers.push(randomNumber);
      numbers.splice(randomIndex, 1);
    }
    
    return randomNumbers;
  }



//JS CODE FOR QUIZ

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const qno = document.getElementById("qno");


let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex=0;
    score=0;
    nextButton.innerHTML="Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    qno.innerHTML = "Question "+questionNo+"/10";
    questionElement.innerHTML = currentQuestion.question;

    currentQuestion.answer.forEach(answer =>{
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("answer-buttons");
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }  
        button.addEventListener("click",selectAnswer);
    });

}

function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score=score+5;
    }else{
        selectedBtn.classList.add("incorrect");
    }
    //now here add 2 css styles .correct and .incorrect
    Array.from(answerButtons.children).forEach(button =>{
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled =true;
    });
    nextButton.style.display = "block";
    // add .btn:hover:not([disabled]) in css
    //.btn:disabled{
    //    cursor:no-drop;
    //}
}

function showScore(){
    resetState();
    //questionElement.innetHTML = `You Scored ${score} out of 10`;
    //questionElement.innerHTML = "Thankyou for Completing the Quiz!! Please Enter your name to access Leaderboard!"

    nextButton.innerHTML = "Finish";
    nextButton.style.display = "block";
    questionElement.innerHTML = "Thank You for completing the Quiz!!";
    qno.innerHTML = "You have scored "+score+" !!";

    form.style.display="block"

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission
        submitScore(); // Call the submitScore function
    });
    //questionElement.appendChild(submitButton);

    nextButton.addEventListener('click',function(){
        window.location.href = '/'
    });
}

function submitScore(){
    const name= document.getElementById("name-input").value;

    const data = {
        name: name,
        score: score,
        quiz_type: selectedCategory
    };

    $.ajax({
        type: "POST",
        url: "/results/", // Adjust URL to your backend endpoint
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        },
        success: function(response) {
            // Handle success response from backend
            console.log("Score submitted successfully:", response);
            // Redirect to results page
            window.location.href = '/results/leaderboard/?quiz_type='+selectedCategory;
        },
        error: function(xhr, status, error) {
            // Handle error response from backend
            console.log("Error submitting score:", error);
        }
    });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        nextButton.removeEventListener('click', handleNextButton);
        console.log("Removed Next Btn");
        showScore();
    }
}


nextButton.addEventListener('click',()=>{
    if(currentQuestionIndex < questions.length){ 
        handleNextButton();
    }else{
        //startQuiz();
        window.location.href='/';
    }
});


window.onload= () =>{
    
    gettingDATA();
}

 

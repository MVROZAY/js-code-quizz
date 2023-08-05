const questions = [
    {
      question: "What is the capital of France?",
      choices: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      question: "What is 2 + 2?",
      choices: ["3", "4", "5", "6"],
      correctAnswer: "4",
    },
    // Add more questions here...
  ];
  
  const startBtn = document.getElementById("start-btn");
  const questionNumberElement = document.getElementById("question-number");
  const questionTextElement = document.getElementById("question-text");
  const choicesContainer = document.getElementById("choices");
  const finalScoreElement = document.getElementById("final-score");
  const highScoreForm = document.getElementById("high-score-form");
  const startOverBtn = document.getElementById("start-over-btn");
  const viewHighScoresLink = document.getElementById("view-high-scores");
  const timerElement = document.getElementById("timer");
  const highScoresList = document.getElementById("high-scores-list");
  const goBackBtn = document.getElementById("go-back-btn");
  const clearScoresBtn = document.getElementById("clear-scores-btn");
  
  let currentQuestionIndex = 0;
  let timeLeft = 60;
  let timerInterval;
  
  startBtn.addEventListener("click", startQuiz);
  choicesContainer.addEventListener("click", handleChoiceClick);
  highScoreForm.addEventListener("submit", saveHighScore);
  startOverBtn.addEventListener("click", startOver);
  viewHighScoresLink.addEventListener("click", viewHighScores);
  goBackBtn.addEventListener("click", goBackToStart);
  clearScoresBtn.addEventListener("click", clearHighScores);
  
  function viewHighScores() {
    hideAllPages();
    document.getElementById("high-scores-page").style.display = "block";
    displayHighScores();
  }
  
  function goBackToStart() {
    hideAllPages();
    document.getElementById("start-page").style.display = "block";
    currentQuestionIndex = 0;
    timeLeft = 60;
    clearInterval(timerInterval);
  }
  
  function clearHighScores() {
    localStorage.removeItem("highScores");
    highScoresList.innerHTML = "";
  }
  
  function hideAllPages() {
    const pages = document.getElementsByClassName("page");
    for (let i = 0; i < pages.length; i++) {
      pages[i].style.display = "none";
    }
  }
  
  function startQuiz() {
    hideAllPages();
    document.getElementById("quiz-page").style.display = "block";
    startTimer();
    showQuestion();
  
    // Clear the initials input when starting the quiz
    const initialsInput = document.getElementById("initials");
    initialsInput.value = "";
  }
  
  function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionNumberElement.textContent = currentQuestionIndex + 1;
    questionTextElement.textContent = question.question;
    choicesContainer.innerHTML = "";
  
    question.choices.forEach((choice) => {
      const choiceBtn = document.createElement("button");
      choiceBtn.textContent = choice;
      choiceBtn.classList.add("choice-btn");
      choicesContainer.appendChild(choiceBtn);
    });
  }
  
  function handleChoiceClick(event) {
    if (!event.target.classList.contains("choice-btn")) return;
    const selectedAnswer = event.target.textContent;
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
  
    if (selectedAnswer === correctAnswer) {
      showFeedback("Correct !");
    } else {
      timeLeft -= 10;
      if (timeLeft <= 0) {
        timeLeft = 0;
        endQuiz();
      } else {
        showFeedback("Wrong !");
      }
    }
  
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }
  
  function showFeedback(message) {
    const feedbackDiv = document.createElement("div");
    feedbackDiv.textContent = message;
    feedbackDiv.classList.add("feedback");
    choicesContainer.appendChild(feedbackDiv);
    setTimeout(() => feedbackDiv.remove(), 1000);
  }
  
  function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById("quiz-page").style.display = "none";
    document.getElementById("end-page").style.display = "block";
    finalScoreElement.textContent = timeLeft;
  }
  
  function startTimer() {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }
  
  function updateTimer() {
    timerElement.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      timeLeft = 0;
      endQuiz();
    } else {
      timeLeft--;
    }
  }
  
  function saveHighScore(event) {
    event.preventDefault();
    const initialsInput = document.getElementById("initials");
    const initials = initialsInput.value.trim().toUpperCase();
    if (!initials) return;
  
    // Save the high score to local storage
    const highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
    const newHighScore = {
      initials,
      score: timeLeft,
    };
    highScores.push(newHighScore);
    localStorage.setItem("highScores", JSON.stringify(highScores));
  
    // Show high scores page after saving the score
    viewHighScores();
  }
  
  function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
    highScores.sort((a, b) => b.score - a.score);
    highScoresList.innerHTML = "";
    highScores.forEach((score, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${score.initials}: ${score.score}`;
      highScoresList.appendChild(listItem);
    });
  }
  
  function startOver() {
    hideAllPages();
    document.getElementById("start-page").style.display = "block";
    currentQuestionIndex = 0;
    timeLeft = 60;
    clearInterval(timerInterval);
  }
  
let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let username = localStorage.getItem("username");

document.addEventListener("DOMContentLoaded", () => {
  // Update header buttons visibility
  const startBtn = document.getElementById("startQuizBtn");
  const signInBtn = document.getElementById("signInBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (username) {
    if (startBtn) startBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (signInBtn) signInBtn.style.display = "none";
  } else {
    if (startBtn) startBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (signInBtn) signInBtn.style.display = "inline-block";
  }

  // Auto-load quiz questions if on quiz page
  if (location.pathname.endsWith("quiz.html")) {
    if (!username) {
      window.location.href = "signin.html";
      return;
    }
    loadQuestions();
  }
});

function goToSignIn() {
  window.location.href = "signin.html";
}

function signIn() {
  const name = document.getElementById("username").value.trim();
  if (name) {
    localStorage.setItem("username", name);
    window.location.href = "index.html";
  } else {
    alert("Please enter your name");
  }
}

function logout() {
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

function startQuiz() {
  window.location.href = "quiz.html";
}

async function loadQuestions() {
  const res = await fetch("/api/questions");
  let data = await res.json();
  questions = shuffleArray(data).slice(0, 10); // Pick 10 random questions
  showQuestion();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showQuestion() {
  const q = questions[currentIndex];
  document.getElementById("question").innerText = q.question;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  shuffleArray(q.options).forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.className = "option";
    btn.onclick = () => checkAnswer(btn, q.answer);
    optionsDiv.appendChild(btn);
  });
  startTimer();
}

function startTimer() {
  let timeLeft = 15;
  document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function checkAnswer(btn, correct) {
  clearInterval(timer);
  document.querySelectorAll(".option").forEach(o => (o.disabled = true));
  if (btn.innerText === correct) {
    btn.classList.add("correct");
    score++;
  } else {
    btn.classList.add("wrong");
  }
  setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) showQuestion();
  else finishQuiz();
}
function finishQuiz() {
  clearInterval(timer);

  // Save the result data in localStorage
  const scoreData = {
    name: localStorage.getItem("username") || "Guest",
    score: score,
    total: questions.length
  };

  localStorage.setItem("quizResult", JSON.stringify(scoreData));

  // Redirect to result page
  window.location.href = "result.html";
}


  // --- Sign In / Register Logic ---
function signInUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const message = document.getElementById("message");

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (!emailPattern.test(email)) {
    message.style.color = "crimson";
    message.textContent = "⚠ Please enter a valid email address.";
    return;
  }

  if (password.length < 6) {
    message.style.color = "crimson";
    message.textContent = "⚠ Password must be at least 6 characters.";
    return;
  }

  if (password !== confirmPassword) {
    message.style.color = "crimson";
    message.textContent = "⚠ Passwords do not match.";
    return;
  }


  // Save user info locally
   localStorage.setItem("userEmail", email);
  localStorage.setItem("userPassword", password);
  localStorage.setItem("isLoggedIn", "true");

  message.style.color = "green";
  message.textContent = "✅ Sign-in successful! Redirecting...";

  // Redirect to home page
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signInBtn");
  const startQuizBtn = document.getElementById("startQuizBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (signInBtn && startQuizBtn && logoutBtn) {
    if (isLoggedIn === "true") {
      signInBtn.style.display = "none";
      startQuizBtn.style.display = "inline-block";
      logoutBtn.style.display = "inline-block";
    } else {
      signInBtn.style.display = "inline-block";
      startQuizBtn.style.display = "none";
      logoutBtn.style.display = "none";
    }
  }
});


// --- Navigation and Logout Functions ---
function goToSignIn() {
  window.location.href = "signin.html";
}

function startQuiz() {
  window.location.href = "quiz.html";
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userPassword");
  alert("You have been logged out successfully.");
  window.location.href = "signin.html";
}


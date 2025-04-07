/* script.js */

// Variáveis globais e referências aos elementos
let carbonLevel = 0;
const carbonMeter = document.getElementById("carbonMeter");
const emailList = document.getElementById("emailList");
const errorModal = document.getElementById("errorModal");
const quizModal = document.getElementById("quizModal");
const randomPopup = document.getElementById("randomPopup");
const randomPopupText = document.getElementById("randomPopupText");
const gameOverMessage = document.getElementById("gameOverMessage");
const closeQuizBtn = document.getElementById("closeQuiz");
const languageSelect = document.getElementById("languageSelect");

let currentLanguage = "pt";
let questions = [];
let translations = {};

// Carregar perguntas do quiz a partir do arquivo JSON
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
    })
    .catch(err => console.error("Erro ao carregar questions.json:", err));

// Carregar traduções e templates de emails do arquivo JSON
fetch('translations.json')
    .then(response => response.json())
    .then(data => {
        translations = data;
        applyTranslations();
    })
    .catch(err => console.error("Erro ao carregar translations.json:", err));

// Aplica as traduções aos elementos da página
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            elem.innerText = translations[currentLanguage][key];
        }
    });
}

// Atualiza a barra de pegada de carbono
function updateCarbonMeter() {
    carbonMeter.style.width = carbonLevel + "%";
    if (carbonLevel >= 100) {
        endGame();
    }
}

// Cria e adiciona um novo email à lista (simula a interface do Gmail)
function spawnEmail() {
    const emailTemplates = translations[currentLanguage]?.emailTemplates || [];
    const randomIndex = Math.floor(Math.random() * emailTemplates.length);
    const emailText = emailTemplates[randomIndex];
    const isSafe = Math.random() < 0.5; // Define aleatoriamente se o email é seguro

    const emailDiv = document.createElement("div");
    emailDiv.className = "email-item";
    emailDiv.innerHTML = `<span><a href="#" class="link-text">${emailText}</a></span>
    <div class="btn-group">
      <button class="safe-btn" onclick="handleLink(this, ${isSafe})">${translations[currentLanguage].safeBtn}</button>
      <button class="malicious-btn" onclick="handleLink(this, ${!isSafe})">${translations[currentLanguage].maliciousBtn}</button>
    </div>`;
    emailList.appendChild(emailDiv);
}

// Trata a escolha do usuário ao clicar no botão do email
function handleLink(button, isCorrect) {
    if (isCorrect) {
        carbonLevel = Math.max(0, carbonLevel - 10);
        alert(translations[currentLanguage].correctAlert);
    } else {
        carbonLevel = Math.min(100, carbonLevel + 20);
        showErrorModal();
        setTimeout(showQuizModal, 1000);
    }
    updateCarbonMeter();
}

// Exibe o modal de erro
function showErrorModal() {
    errorModal.style.display = "block";
    setTimeout(() => {
        errorModal.style.display = "none";
    }, 2000);
}

// Exibe o modal do quiz com uma pergunta aleatória (do arquivo questions.json)
function showQuizModal() {
    if (questions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * questions.length);
    const quiz = questions[randomIndex][currentLanguage];
    document.getElementById("quizQuestion").innerText = quiz.question;
    const quizOptionsDiv = document.getElementById("quizOptions");
    quizOptionsDiv.innerHTML = "";
    quiz.options.forEach(option => {
        const btn = document.createElement("button");
        btn.className = "quiz-btn";
        btn.innerText = option.text;
        btn.onclick = function () { handleQuizAnswer(option.isCorrect); };
        quizOptionsDiv.appendChild(btn);
    });
    closeQuizBtn.style.display = "none";
    quizModal.style.display = "block";
}

// Trata a resposta do quiz
function handleQuizAnswer(isCorrect) {
    if (isCorrect) {
        carbonLevel = Math.max(0, carbonLevel - 10);
        closeQuizBtn.style.display = "inline-block";
        alert(translations[currentLanguage].quizCorrect);
    } else {
        carbonLevel = Math.min(100, carbonLevel + 20);
        alert(translations[currentLanguage].quizIncorrect);
    }
    updateCarbonMeter();
}

// Fecha o modal do quiz
function closeQuiz() {
    quizModal.style.display = "none";
}
closeQuizBtn.addEventListener("click", closeQuiz);

// Exibe um pop-up aleatório simulando um email malicioso
function spawnRandomPopup() {
    const popupMessages = translations[currentLanguage]?.popupMessages || [];
    const msg = popupMessages[Math.floor(Math.random() * popupMessages.length)];
    randomPopupText.innerText = msg;
    randomPopup.style.display = "block";
    setTimeout(() => {
        randomPopup.style.display = "none";
    }, 2500);
}

// Finaliza o jogo quando a pegada de carbono atinge 100%
function endGame() {
    document.querySelectorAll("button").forEach(btn => btn.disabled = true);
    gameOverMessage.style.display = "block";
    const chaosDiv = document.createElement("div");
    chaosDiv.innerHTML = `<p>${translations[currentLanguage].chaosText}</p>`;
    chaosDiv.style.backgroundColor = "#ffc";
    chaosDiv.style.padding = "10px";
    chaosDiv.style.marginTop = "20px";
    document.body.appendChild(chaosDiv);
}

// Muda o idioma ao selecionar uma opção
languageSelect.addEventListener("change", function () {
    currentLanguage = languageSelect.value;
    applyTranslations();
});

// Intervalos para spawn de emails e pop-ups aleatórios
setInterval(spawnEmail, 5000);
setInterval(spawnRandomPopup, 15000);

// Atualiza a barra de carbono no carregamento
updateCarbonMeter();
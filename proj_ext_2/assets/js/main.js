"use strict";

// Variáveis globais para armazenar dados e configurações
let currentLanguage = "pt"; // idioma padrão
window.i18n = {}; // objeto que armazenará os textos de acordo com o idioma carregado
let carbonValue = 0; // valor atual da pegada de carbono (em "pixeis" ou percentual, conforme ajuste)
const maxCarbon = 100; // definir um valor máximo (pode ser em pixels, % etc.)

document.addEventListener("DOMContentLoaded", () => {
  // Carrega o idioma padrão e renderiza a interface
  loadLanguage(currentLanguage);
  renderLinkList();
  initEventListeners();
});

//
// === Funções para Renderização da Lista de Links (Simulação de "E-mails") ===
//

function renderLinkList() {
  const linkList = document.querySelector(".link-list");
  // Obter os dados dos links (exemplo simples)
  const links = getLinksData();

  // Limpa a lista (útil em caso de atualização)
  linkList.innerHTML = "";

  links.forEach((link) => {
    // Cria um item da lista
    const listItem = document.createElement("li");
    listItem.classList.add("link-item");

    // Template com estrutura similar a um e-mail
    listItem.innerHTML = `
      <div class="mail-info">
        <span class="sender">${link.sender}</span>
        <span class="subject-preview">${link.subject}</span>
        <span class="url">${link.url}</span>
      </div>
      <div class="actions">
        <button class="btn-safe" data-correct="${link.isSafe}">
          ${i18n.safeText || "Seguro"}
        </button>
        <button class="btn-unsafe" data-correct="${!link.isSafe}">
          ${i18n.unsafeText || "Não Seguro"}
        </button>
      </div>
    `;
    linkList.appendChild(listItem);
  });
}

//
// === Função para Iniciar os EventListeners ===
//

function initEventListeners() {
  // Delegação de evento para botões de link (Seguro/Não Seguro)
  document.querySelector(".link-list").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      // Obtém a informação se a resposta está correta
      const isCorrect = e.target.getAttribute("data-correct") === "true";
      if (isCorrect) {
        decreaseCarbonMeter();
      } else {
        increaseCarbonMeter(15); // aumenta um valor arbitrário (ex: 15)
        showErrorPopUp();
        showQuizModal();
      }
      // Verifica se atingiu o fim do jogo
      checkGameOver();
    }
  });

  // Listener para switch de idiomas
  document.querySelectorAll(".language-switch button").forEach((button) => {
    button.addEventListener("click", () => {
      currentLanguage = button.getAttribute("data-lang");
      loadLanguage(currentLanguage);
    });
  });
}

//
// === Funções para Gerenciar a Barra de Pegada de Carbono ===
//

function increaseCarbonMeter(amount = 10) {
  const meterBar = document.getElementById("meterBar");
  carbonValue = Math.min(carbonValue + amount, maxCarbon);
  updateCarbonMeter(meterBar);
}

function decreaseCarbonMeter(amount = 10) {
  const meterBar = document.getElementById("meterBar");
  carbonValue = Math.max(carbonValue - amount, 0);
  updateCarbonMeter(meterBar);
}

function updateCarbonMeter(meterBar) {
  // Calcula a largura proporcional (exemplo: 100px é o tamanho máximo visual)
  const maxWidth = 100;
  const newWidth = (carbonValue / maxCarbon) * maxWidth;
  meterBar.style.width = `${newWidth}px`;
}

//
// === Função para Exibir Pop-up de Erro (Pop-up “estranho”) ===
//

function showErrorPopUp() {
  const popUp = document.getElementById("popUpError");
  popUp.style.display = "block";
  // Pode incluir lógica para animar o pop-up ou fazer com que apareça de diferentes lados
  // Exemplo: definir um timer para desaparecer depois de um tempo (se desejado)
}

//
// === Função para Gerenciar o Modal do Quiz ===
//

function showQuizModal() {
  const modalQuiz = document.getElementById("modalQuiz");
  // Obtém dados do quiz
  const quizData = getQuizData();
  document.getElementById("quizQuestion").innerText =
    quizData.question || "Qual a segurança desse link?";
  const optionsContainer = document.getElementById("quizOptions");
  optionsContainer.innerHTML = "";

  quizData.options.forEach((option) => {
    const btnOption = document.createElement("button");
    btnOption.innerText = option.text;
    btnOption.addEventListener("click", () => {
      if (option.correct) {
        btnOption.classList.add("correct");
        decreaseCarbonMeter(10);
      } else {
        btnOption.classList.add("wrong");
        increaseCarbonMeter(10);
      }
      // Fecha o modal automaticamente após um curto tempo
      setTimeout(() => {
        modalQuiz.style.display = "none";
      }, 1500);
    });
    optionsContainer.appendChild(btnOption);
  });
  modalQuiz.style.display = "flex";
}

//
// === Função para Checar Condição de Fim de Jogo ===
//

function checkGameOver() {
  if (carbonValue >= maxCarbon) {
    showEndGameModal();
  }
}

function showEndGameModal() {
  const modalEndgame = document.getElementById("modalEndgame");
  modalEndgame.style.display = "flex";

  // Aqui, para simular "caos", você pode:
  // - Injetar novos links "maliciosos"
  // - Exibir múltiplos pop-ups
  // - Alterar a interface para um visual caótico
  // Esta lógica pode ser expandida conforme necessário.
}

//
// === Funções de Internacionalização (i18n) ===
//

function loadLanguage(langCode) {
  fetch(`i18n/${langCode}.json`)
    .then((response) => response.json())
    .then((data) => {
      window.i18n = data;
      updateTexts();
      // Re-renderiza os elementos que dependem do i18n
      renderLinkList();
    })
    .catch((error) => console.error("Erro ao carregar idioma:", error));
}

function updateTexts() {
  // Atualiza textos fixos da página
  const headerTitle = document.querySelector(".gmail-header .header-left + .header-center ~ .header-right");
  // Se houver elementos com textos que precisam ser atualizados, faça:
  document.querySelector("title").innerText = window.i18n.gameTitle || "Jogo de Segurança Digital";
  
  // Exemplo: atualizar o título do modal do fim de jogo
  const endGameTitle = document.querySelector("#modalEndgame .modal-content h2");
  if (endGameTitle) endGameTitle.innerText = window.i18n.endGameTitle || "Jogo Encerrado";

  // Atualize outros elementos conforme as chaves definidas no seu JSON
}

//
// === Funções Simuladoras dos Dados ===
//

function getLinksData() {
  // Exemplo de dados para cada "e-mail" (link)
  return [
    {
      sender: "Site Seguro Inc.",
      subject: "Sua segurança é nossa prioridade",
      url: "http://site-seguro.com",
      isSafe: true,
    },
    {
      sender: "Ofertas Incríveis",
      subject: "Clique para ganhar prêmios!",
      url: "http://ofertas-maliciosas.com",
      isSafe: false,
    },
    {
      sender: "Notícias Online",
      subject: "Última hora: novidades importantes",
      url: "http://noticiasonline.com",
      isSafe: true,
    },
  ];
}

function getQuizData() {
  // Exemplo de quiz com perguntas simples para o público infantil
  return {
    question: i18n.quizQuestionExample || "O que faz um link ser seguro?",
    options: [
      { text: i18n.quizAnswerA || "É de um site confiável", correct: true },
      { text: i18n.quizAnswerB || "Tem muitos pop-ups", correct: false },
      { text: i18n.quizAnswerC || "Vem com imagens estranhas", correct: false },
      { text: i18n.quizAnswerD || "Sempre abre uma nova janela", correct: false },
    ],
  };
}

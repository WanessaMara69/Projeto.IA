function gerarConteudo(prompt, typingIndicator) {
  const apiKey = ""; // Chave de API
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const data = {
    contents: [
      {
        parts: [
          {
            text: prompt + "Responda de forma curta e objetiva.",
          },
        ],
      },
    ],
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json()) // Converte para JSON
    .then((result) => {
      typingIndicator.remove(); // Remove o efeito "digitando..."

      // Verifica se a resposta da API contém um texto válido
      if (result.candidates && result.candidates[0].content.parts[0].text) {
        const resposta = result.candidates[0].content.parts[0].text;
        console.log("Resposta da IA:", resposta);
        addMessage(resposta, "bot");
      } else {
        addMessage("Desculpe, não consegui entender sua pergunta.", "bot");
      }
    })
    .catch((error) => {
      console.error("Erro ao gerar conteúdo:", error);
      typingIndicator.remove();
      addMessage("Erro ao obter resposta da IA.", "bot");
    });
}

function perguntar() {
  const prompt = document.getElementById("prompt").value.trim();
  const result = document.getElementById("result");

  if (!prompt) return; // Evita mensagens vazias

  // Adiciona a mensagem do usuário no chat
  addMessage(prompt, "user");

  // Exibe efeito "digitando..." da IA
  const typingIndicator = addMessage(
    '<div class="typing"><span>.</span><span>.</span><span>.</span></div>',
    "bot"
  );

  // Chama a função para gerar a resposta da IA e passa o indicador de digitação para removê-lo depois
  gerarConteudo(prompt, typingIndicator);

  // Limpa o campo de entrada
  document.getElementById("prompt").value = "";
}

// Função para adicionar mensagens ao chat
function addMessage(text, sender) {
  const result = document.getElementById("result");

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerHTML = text;

  result.appendChild(messageDiv);

  // Mantém a rolagem sempre na última mensagem
  result.scrollTop = result.scrollHeight;

  return messageDiv;
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Negrito
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Itálico
    .replace(/\n/g, "<br>"); // Quebra de linha
}

// Função para tornar o botão móvel
function dragButton(button) {
  let offsetX,
    offsetY,
    isDragging = false;

  button.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - button.getBoundingClientRect().left;
    offsetY = e.clientY - button.getBoundingClientRect().top;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;

      // Mantém o botão dentro da tela
      x = Math.max(0, Math.min(window.innerWidth - button.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - button.offsetHeight, y));

      button.style.left = x + "px";
      button.style.top = y + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

// Função para mostrar ou esconder o chat próximo ao botão
function toggleChat() {
  const chatBox = document.querySelector(".chat-container");
  const chatButton = document.querySelector(".chat-button");

  if (chatBox.style.display === "none" || chatBox.style.display === "") {
    chatBox.style.display = "flex"; // Mostra o chat
    chatBox.classList.add("show"); // Adiciona a classe

    // Posiciona o chat próximo ao botão
    const buttonRect = chatButton.getBoundingClientRect();
    chatBox.style.left = buttonRect.left + "px";
    chatBox.style.top = buttonRect.top - chatBox.offsetHeight - 10 + "px"; // Acima do botão

    // Ajusta caso o chat ultrapasse os limites da tela
    if (
      parseInt(chatBox.style.left) + chatBox.offsetWidth >
      window.innerWidth
    ) {
      chatBox.style.left = window.innerWidth - chatBox.offsetWidth - 10 + "px";
    }
    if (parseInt(chatBox.style.top) < 0) {
      chatBox.style.top = buttonRect.bottom + 10 + "px"; // Se não couber em cima, coloca embaixo
    }
  } else {
    chatBox.style.display = "none"; // Esconde o chat
    chatBox.classList.remove("show");
  }
}

// Aplica as funções quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  const chatButton = document.querySelector(".chat-button");
  chatButton.style.position = "fixed"; // Garante que o botão fique fixo na tela
  dragButton(chatButton);
});

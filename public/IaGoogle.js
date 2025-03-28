function gerarConteudo(prompt) {
  console.log(prompt);
  // Simulando um banco de dados com respostas pré-definidas
  const baseDeRespostas = {
    "qual é o site da sefin?": "https://www.sefin.fortaleza.ce.gov.br/Home",
    "qual o site do google?":
      "<a href='https://www.google.com' target='_blank'>Google</a>",
  };

  const result = baseDeRespostas[prompt.toLowerCase()] || null;
  console.log();

  if (result) {
    const resposta = result;
    console.log("Resposta da IA:", resposta);
    addMessage(resposta, "bot");
  } else {
    addMessage("Desculpe, não consegui entender sua pergunta.", "bot");
  }
}

async function perguntar() {
  const prompt = document.getElementById("prompt").value.trim();
  const result = document.getElementById("result");

  if (!prompt) return; // Evita mensagens vazias

  // Adiciona a mensagem do usuário no chat
  addMessage(prompt, "user");

  try {
    // Faz a requisição para o backend e aguarda a resposta
    const resposta = await fetch("http://localhost:3000/perguntar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta: prompt }),
    });

    // Verifica se a resposta foi bem-sucedida
    if (!resposta.ok) {
      throw new Error(
        `Resposta da API não foi bem-sucedida. Status: ${resposta.status}`
      );
    }

    // Converte a resposta em JSON
    const data = await resposta.json();

    // Verifica se a resposta contém uma URL e a transforma em link clicável
    const respostaComLink = data.resposta.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$&" target="_blank">$&</a>'
    );

    // Exibe a resposta formatada no chat
    addMessage(respostaComLink, "bot");
  } catch (error) {
    // Se der erro na requisição
    addMessage("Erro ao buscar resposta. Tente novamente.", "bot");
    console.error("Erro na requisição:", error);
  }

  // Limpa o campo de entrada
  document.getElementById("prompt").value = "";
}

// Função para adicionar mensagens ao chat
function addMessage(text, sender) {
  const result = document.getElementById("result");

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  // Se for uma mensagem do bot, adiciona o avatar
  if (sender === "bot") {
    const avatar = document.createElement("img");
    avatar.classList.add("avatar");
    avatar.src = "img/marisol2.jpg"; // Caminho para o avatar
    messageDiv.appendChild(avatar); // Adiciona o avatar ao começo da mensagem
  }

  // Adiciona o HTML diretamente, permitindo que o <a> seja interpretado
  messageDiv.innerHTML += text;

  result.appendChild(messageDiv);

  // Mantém a rolagem sempre na última mensagem
  result.scrollTop = result.scrollHeight;

  return messageDiv;
}

function formatText(text) {
  // Aqui, substituímos o Markdown por HTML, mas sem interferir no conteúdo HTML (como <a>)
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Negrito
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Itálico
    .replace(/\n/g, "<br>"); // Quebra de linha
}

function toggleChat() {
  const chatBox = document.querySelector(".chat-container");
  const chatButton = document.querySelector(".chat-button");
  const chatMessageContainer = document.querySelector(
    ".chat-message-container"
  );
  const result = document.getElementById("result");

  if (chatBox.style.display === "none" || chatBox.style.display === "") {
    chatBox.style.display = "flex"; // Mostra o chat
    chatBox.classList.add("show"); // Adiciona a classe de exibição
    chatMessageContainer.style.display = "none";

    // Exibe o conteúdo do chat
    result.style.display = "block";

    // Ajusta a posição do chat para sempre ficar no fundo à direita
    chatBox.style.position = "fixed";
    chatBox.style.right = "10px"; // Coloca o chat à direita
    chatBox.style.bottom = "20px"; // Coloca o chat na parte inferior

    // Ajusta a altura do chat com base no espaço disponível na tela
    if (
      parseInt(chatBox.style.bottom) + chatBox.offsetHeight >
      window.innerHeight
    ) {
      chatBox.style.height = window.innerHeight - 100 + "px"; // Ajusta a altura para não ultrapassar a tela
    }
  } else {
    chatBox.style.display = "none"; // Esconde o chat
    chatBox.classList.remove("show");

    // Mostra novamente o botão e a mensagem
    chatMessageContainer.style.display = "flex";
    result.style.display = "none";

    // Reseta a posição do chat para o canto inferior direito
    chatBox.style.position = "fixed";
    chatBox.style.right = "10px";
    chatBox.style.bottom = "10px";
  }
}

// Aplica as funções quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  const chatButton = document.querySelector(".chat-button");
  chatButton.style.position = "fixed";
});

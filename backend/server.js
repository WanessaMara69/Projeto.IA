const express = require("express");
const cors = require("cors");
const sqlLite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

//Permitir requisições do front
app.use(cors());
app.use(express.json());

// criar/ abrir o banco
const db = new sqlLite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados", err);
  } else {
    console.log("Banco conctado com sucesso");
  }
});

// criar tabala
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS database (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pergunta TEXT,
        resposta TEXT)`);
});

// criar pergunta
db.run(`INSERT INTO database (pergunta, resposta) VALUES (?, ?)`, [
  "Onde encontro o site da sefin?",
  "Você pode acessar em <a href='https://www.sefin.fortaleza.ce.gov.br/Home' target='_blank'>aqui</a>.",
]);

// endpoint para buscar resposta
app.post("/perguntar", (req, res) => {
  const { pergunta } = req.body;

  // Normaliza a pergunta (coloca tudo em minúsculo e remove espaços extras)
  const perguntaNormalizada = pergunta.toLowerCase().trim();

  db.get(
    `SELECT resposta FROM database WHERE LOWER(pergunta) LIKE ?`,
    [`%${perguntaNormalizada}%`],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao consultar banco" });
      }
      if (row) {
        return res.json({ resposta: row.resposta });
      } else {
        return res.json({
          resposta: "Desculpe, não consegui entender sua pergunta.",
        });
      }
    }
  );
});

// iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

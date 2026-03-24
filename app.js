const express = require("express");
const app = express();
const bd = require("./mysql");

app.use(express.json());

app.post("/pontuacao", async (req, res) => {
  const { nome_corrida, nome_equipe, total_voltas, tempo_ultima_volta, velocidade_media, posicao } = req.body;

  try {
    await bd.execute(
      `INSERT INTO pontuacao (nome_pista, nome_equipe, total_voltas, tempo_ultima_volta, velocidade_media, posicao)
       VALUES (
         (SELECT id FROM pistas WHERE nome = ?),
         (SELECT id FROM equipes WHERE nome = ?),
         ?, ?, ?, ?
       )`,
      [nome_corrida, nome_equipe, total_voltas, tempo_ultima_volta, velocidade_media, posicao]
    );

    const [rows] = await bd.execute(
        `SELECT 
           pi.nome AS nome_corrida,
           e.nome AS nome_equipe,
           p.total_voltas,
           p.tempo_ultima_volta,
           p.velocidade_media,
           p.posicao
         FROM pontuacao p
         JOIN pistas pi ON p.nome_pista = pi.id
         JOIN equipes e ON p.nome_equipe = e.id
         WHERE pi.nome = ? AND e.nome = ?
         ORDER BY p.id DESC
         LIMIT 1`,
        [nome_corrida, nome_equipe]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ error: "Nenhum registro encontrado" });
      }
      
      return res.status(200).json(rows);
    
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.use((req, res, next) => {
  const error = new Error("Not Found...");
  error.status = 404;
  next(error);
});

module.exports = app;

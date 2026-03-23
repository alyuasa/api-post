const express = require("express");
const app = express();
const mysql = require('./mysql');

app.post("/pontuacao", async (req, res, next) => {

    // coloca o codigo para conectar com o banco, e inserir os dados do body
    console.log('ola mubndo')
    return res.status(200).send({"Mensagem": "ok"})
});

app.use((req, res, next)=> {
    const error = new Error("Not Found...");
    error.status = 404;
    next(error);
});

module.exports = app;
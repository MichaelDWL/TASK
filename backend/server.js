import express from "express";

const server = express();

/* Rotas 

Publicas 
  Cadastro e Login 
  
Privadas
  Lista Usuários 

*/

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

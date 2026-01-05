-- Script SQL para criar um usuário de teste
-- IMPORTANTE: A senha precisa ser hasheada com bcrypt antes de inserir
-- Use o script create-test-user.js para gerar o hash automaticamente

-- Exemplo de usuário de teste:
-- Email/Login: teste@teste.com ou teste
-- Senha: 123456

-- Para gerar o hash da senha, execute:
-- node backend/scripts/create-test-user.js

-- Ou se preferir inserir manualmente, gere o hash com bcrypt primeiro:
-- O hash de "123456" com saltRounds=10 é aproximadamente: $2b$10$...

-- Exemplo de INSERT (substitua o hash pela senha hasheada):
/*
INSERT INTO users (login, nome_completo, email, senha, role_id)
VALUES (
  'teste',
  'Usuário Teste',
  'teste@teste.com',
  '$2b$10$...', -- Substitua pelo hash gerado
  1
);
*/

-- Credenciais de teste sugeridas:
-- Email: teste@teste.com
-- Login: teste
-- Senha: 123456


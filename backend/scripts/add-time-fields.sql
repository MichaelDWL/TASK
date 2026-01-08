-- Script para adicionar campos de tempo na tabela tasks
-- Execute este script se os campos inicio_execucao e fim_execucao não existirem

-- Adicionar campo inicio_execucao se não existir
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS inicio_execucao DATETIME NULL 
COMMENT 'Data e hora em que a tarefa foi iniciada';

-- Adicionar campo fim_execucao se não existir
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS fim_execucao DATETIME NULL 
COMMENT 'Data e hora em que a tarefa foi finalizada';

-- Verificar se os campos foram criados
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'tasks'
  AND COLUMN_NAME IN ('inicio_execucao', 'fim_execucao');


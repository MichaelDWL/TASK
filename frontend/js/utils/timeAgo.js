/**
 * Calcula o tempo decorrido entre duas datas e retorna uma string formatada
 * @param {string|Date} startDate - Data de início
 * @param {string|Date} endDate - Data de fim (opcional, usa NOW se não fornecido)
 * @returns {string} - String formatada (ex: "2 horas", "3 dias", "1 semana")
 */
export function calculateTimeAgo(startDate, endDate = null) {
  if (!startDate) return "";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffMs = end - start;

  if (diffMs < 0) return "Agora";

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return "Agora";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "dia" : "dias"}`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? "semana" : "semanas"}`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? "mês" : "meses"}`;
  } else {
    return `${diffYears} ${diffYears === 1 ? "ano" : "anos"}`;
  }
}

/**
 * Calcula o tempo total que uma tarefa ficou aberta (desde criação até finalização)
 * @param {string|Date} createdDate - Data de criação
 * @param {string|Date} finishedDate - Data de finalização
 * @returns {string} - String formatada
 */
export function calculateTotalTime(createdDate, finishedDate) {
  if (!createdDate || !finishedDate) return "";

  return calculateTimeAgo(createdDate, finishedDate);
}


export interface Lead {
  id: string; // Gerado internamente para react key
  nome: string;
  cpf: string;
  empresa: string;
  telefone: string;
  dataHora: string; // ISO string ou formato "dd/mm/aaaa hh:mm" da planilha
}

// Funo para gerar IDs nicos simples
export const generateId = () => Math.random().toString(36).substr(2, 9);

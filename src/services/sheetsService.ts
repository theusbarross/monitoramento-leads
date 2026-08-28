import type { Lead } from '../types';
import { generateId } from '../types';

export const fetchLeads = async (): Promise<Lead[]> => {
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || 'AIzaSyDbT3uTumchoG7Y1uaoKJkMPC4hZCS5XaI';
  const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID || '11adBXV_SEZU4ULPXt_23iR61wCuRcrhYm7DIHTUinvc';

  if (!apiKey || !spreadsheetId) {
    console.warn('API Key ou Spreadsheet ID não configurados no .env. Usando dados vazios.');
    return [];
  }

  // Assumimos que os dados estão na primeira aba, no range de A a Z.
  // Pode ser necessário ajustar o range dependendo do nome da aba (ex: "Página1!A:Z")
  // A API por padrão com apenas "A:Z" tentará buscar, mas para ser seguro
  // idealmente buscaríamos o nome da aba antes. Mas vamos tentar buscar apenas os valores.
  
  // Pegamos especificamente da aba "Leads" onde estão os dados reais
  const range = 'Leads!A:Z'; 
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta da API:', errorData);
      throw new Error(errorData.error?.message || 'Erro ao buscar dados do Google Sheets');
    }

    const data = await response.json();
    const rows = data.values as string[][];

    if (!rows || rows.length === 0) {
      return [];
    }

    // Remove acentos e converte para minúsculo
    const normalizeStr = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    
    // A primeira linha geralmente é o cabeçalho
    const headers = rows[0].map(normalizeStr);
    console.log('Cabeçalhos encontrados:', headers);
    const leads: Lead[] = [];

    // Iteramos a partir da segunda linha
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Mapeamento dinâmico baseado no cabeçalho
      const getVal = (possibleNames: string[]) => {
        const normalizedNames = possibleNames.map(normalizeStr);
        const index = headers.findIndex(h => normalizedNames.includes(h));
        return index !== -1 && row[index] ? row[index].trim() : '';
      };

      const nome = getVal(['nome', 'name', 'operações', 'operacoes']);
      
      if (!nome) {
        console.warn('Linha ignorada por não ter nome:', row);
        continue;
      }

      leads.push({
        id: generateId(),
        nome: nome || 'Sem nome',
        cpf: getVal(['cpf']),
        empresa: getVal(['empresa', 'company', 'operações', 'operacoes']),
        telefone: getVal(['telefone', 'phone']),
        dataHora: getVal(['data', 'datahora', 'date', 'hora e data']) || new Date().toISOString()
      });
    }

    console.log('Leads processados com sucesso:', leads.length);
    console.log('Primeiros leads:', leads.slice(0, 2));
    return leads;
  } catch (error) {
    console.error('Erro ao acessar Google Sheets API:', error);
    throw error;
  }
};

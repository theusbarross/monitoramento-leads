import type { Lead } from '../types';
import { format, subDays, subHours, subMinutes } from 'date-fns';
import { generateId } from '../types';

const empresas = ['Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp'];
const nomes = ['João Silva', 'Maria Oliveira', 'Carlos Souza', 'Ana Costa', 'Pedro Santos', 'Fernanda Lima'];

// Formato esperado da planilha: "dd/MM/yyyy HH:mm"
const formatToSheetDate = (date: Date) => format(date, 'dd/MM/yyyy HH:mm');

export const generateMockLeads = (count: number = 100): Lead[] => {
  const leads: Lead[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    // Distribuir dados no tempo (maioria nos últimos 7 dias, alguns hoje, alguns horas atrás)
    const randomDays = Math.floor(Math.random() * 30);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);

    let date = now;
    if (i < count * 0.2) {
      // 20% hoje nas ultimas horas
      date = subHours(subMinutes(now, randomMinutes), randomHours % 12);
    } else if (i < count * 0.5) {
      // 30% nos ultimos 7 dias
      date = subDays(subHours(now, randomHours), randomDays % 7);
    } else {
      // 50% nos ultimos 30 dias
      date = subDays(subHours(now, randomHours), randomDays);
    }

    const cpf = Math.floor(10000000000 + Math.random() * 90000000000).toString(); // Gera 11 digitos
    const telefone = `119${Math.floor(10000000 + Math.random() * 90000000)}`;

    leads.push({
      id: generateId(),
      nome: nomes[Math.floor(Math.random() * nomes.length)],
      cpf,
      empresa: empresas[Math.floor(Math.random() * empresas.length)],
      telefone,
      dataHora: formatToSheetDate(date),
    });
  }

  // Ordenar do mais recente para o mais antigo (comportamento comum em planilhas alimentadas no topo ou fundo)
  return leads.sort((a, b) => {
    // Como o formato é dd/MM/yyyy HH:mm, precisamos converter para ordenar
    const parseDate = (str: string) => {
      const [datePart, timePart] = str.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hour, min] = timePart.split(':');
      return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(min)).getTime();
    };
    return parseDate(b.dataHora) - parseDate(a.dataHora);
  });
};

export const MOCK_LEADS = generateMockLeads(150);

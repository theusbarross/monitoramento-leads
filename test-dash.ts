import { fetchLeads } from './src/services/sheetsService.ts';
import { isToday, parse } from 'date-fns';
import { parseSheetDate } from './src/utils/formatters.ts';

// Fake Vite's import.meta.env
(globalThis as any).import = { meta: { env: { 
  VITE_GOOGLE_SHEETS_API_KEY: 'AIzaSyDbT3uTumchoG7Y1uaoKJkMPC4hZCS5XaI', 
  VITE_SPREADSHEET_ID: '11adBXV_SEZU4ULPXt_23iR61wCuRcrhYm7DIHTUinvc' 
} } };

async function test() {
  const leads = await fetchLeads();
  console.log('Total leads fetched:', leads.length);
  
  if (!leads.length) {
    console.log('No leads!');
    return;
  }

  const selectedCompany = 'JB';
  const startDate = '2026-04-01';
  const endDate = '2026-04-01';

  // Filter leads (like Dashboard.tsx)
  const filteredLeads = leads.filter(lead => {
    if (selectedCompany && lead.empresa !== selectedCompany) {
      return false;
    }
    
    if (startDate || endDate) {
      const leadDate = parseSheetDate(lead.dataHora);
      const start = startDate ? new Date(startDate + 'T00:00:00') : new Date(0);
      const end = endDate ? new Date(endDate + 'T23:59:59') : new Date(8640000000000000);
      
      if (leadDate.getTime() < start.getTime() || leadDate.getTime() > end.getTime()) {
        return false;
      }
    }
    
    return true;
  });

  console.log('Filtered Leads count:', filteredLeads.length);

  const total = filteredLeads.length;
  let todayCount = 0;
  let lastHourCount = 0;
  const companyCounts: Record<string, number> = {};
  
  const now = new Date();

  filteredLeads.forEach(lead => {
    const date = parseSheetDate(lead.dataHora);
    
    // Hoje
    if (isToday(date)) {
      todayCount++;
    }
    
    // Ultima hora
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours <= 1) {
      lastHourCount++;
    }

    // Empresas
    companyCounts[lead.empresa] = (companyCounts[lead.empresa] || 0) + 1;
  });

  let topCompany = '-';
  let maxCount = 0;
  Object.entries(companyCounts).forEach(([company, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCompany = company;
    }
  });

  console.log({ total, today: todayCount, lastHour: lastHourCount, topCompany });
}

test().catch(console.error);

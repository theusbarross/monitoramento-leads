import React, { useMemo, useState } from 'react';
import { Layout } from './Layout/Layout';
import { MetricCard } from './Cards/MetricCard';
import { Filters } from './Filters/Filters';
import { useLeadsData } from '../hooks/useLeadsData';
import { Users, Clock, Calendar, Building2 } from 'lucide-react';
import { isToday, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import styles from './Dashboard.module.css';
import { parseSheetDate } from '../utils/formatters';

import { LeadsTrendChart } from './Charts/LeadsTrendChart';
import { CompanyDistributionChart } from './Charts/CompanyDistributionChart';
import { LeadsTable } from './Table/LeadsTable';

export const Dashboard: React.FC = () => {
  const { leads, loading, error, lastUpdated, refetch, isConfigured } = useLeadsData();

  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Extrair empresas únicas
  const companies = useMemo(() => {
    const unique = new Set(leads.map(l => l.empresa));
    return Array.from(unique).filter(Boolean).sort();
  }, [leads]);

  // Leads filtrados
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Filtro por empresa
      if (selectedCompany && lead.empresa !== selectedCompany) {
        return false;
      }
      
      // Filtro por data
      if (startDate || endDate) {
        const leadDate = parseSheetDate(lead.dataHora);
        const start = startDate ? startOfDay(new Date(startDate + 'T00:00:00')) : new Date(0);
        const end = endDate ? endOfDay(new Date(endDate + 'T23:59:59')) : new Date(8640000000000000);
        
        if (!isWithinInterval(leadDate, { start, end })) {
          return false;
        }
      }
      
      return true;
    });
  }, [leads, selectedCompany, startDate, endDate]);

  // Métricas computadas
  const metrics = useMemo(() => {
    if (!filteredLeads.length) return { total: 0, today: 0, lastHour: 0, topCompany: '-', topCompanyCount: 0 };

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
      if (lead.empresa) {
        companyCounts[lead.empresa] = (companyCounts[lead.empresa] || 0) + 1;
      }
    });

    let topCompany = '-';
    let maxCount = 0;
    Object.entries(companyCounts).forEach(([company, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCompany = company;
      }
    });

    return { total, today: todayCount, lastHour: lastHourCount, topCompany, topCompanyCount: maxCount };
  }, [filteredLeads]);

  if (!isConfigured) {
    return (
      <Layout lastUpdated={lastUpdated} onRefresh={refetch} loading={loading}>
        <div className={styles.errorContainer} style={{ backgroundColor: '#2a1a1a', border: '1px solid #ff4444' }}>
          <h2>Google Sheets Não Configurado</h2>
          <p>Para ver os dados reais, configure sua chave de API e ID da planilha.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#aaa' }}>Crie/verifique o arquivo <code>.env</code> na raiz do projeto com <code>VITE_GOOGLE_SHEETS_API_KEY</code> e <code>VITE_SPREADSHEET_ID</code>.</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout lastUpdated={lastUpdated} onRefresh={refetch} loading={loading}>
        <div className={styles.errorContainer}>
          <h2>Oops!</h2>
          <p>{error}</p>
          <button onClick={refetch}>Tentar Novamente</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout lastUpdated={lastUpdated} onRefresh={refetch} loading={loading}>
      <Filters 
        companies={companies}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
      />

      <div className={styles.gridCards}>
        <MetricCard 
          title="Total de Leads" 
          value={metrics.total} 
          icon={Users} 
          loading={loading}
        />
        <MetricCard 
          title="Leads Hoje" 
          value={metrics.today} 
          icon={Calendar} 
          loading={loading}
        />
        <MetricCard 
          title="Leads na Última Hora" 
          value={metrics.lastHour} 
          icon={Clock} 
          loading={loading}
        />
        <MetricCard 
          title="Empresa Destaque" 
          value={metrics.topCompany} 
          icon={Building2} 
          loading={loading}
          trend={metrics.topCompany !== '-' ? `${metrics.topCompanyCount} Leads` : undefined}
          trendDirection="neutral"
        />
      </div>

      <div className={styles.gridCharts}>
        <div className={styles.chartPlaceholder}>
          <LeadsTrendChart leads={filteredLeads} />
        </div>
        <div className={styles.chartPlaceholder}>
          <CompanyDistributionChart leads={filteredLeads} />
        </div>
      </div>
      
      <div className={styles.tableSection}>
        <LeadsTable leads={filteredLeads} />
      </div>
    </Layout>
  );
};

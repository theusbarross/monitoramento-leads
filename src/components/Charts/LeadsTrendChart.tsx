import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Lead } from '../../types';
import { parseSheetDate } from '../../utils/formatters';
import { format } from 'date-fns';

interface LeadsTrendChartProps {
  leads: Lead[];
}

export const LeadsTrendChart: React.FC<LeadsTrendChartProps> = ({ leads }) => {
  const data = useMemo(() => {
    const countsByDate: Record<string, number> = {};
    
    leads.forEach(lead => {
      const date = parseSheetDate(lead.dataHora);
      const dateStr = format(date, 'dd/MM');
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    });

    // Converter para array e ordenar (simplificado para exibição rápida)
    return Object.entries(countsByDate)
      .map(([date, count]) => ({ date, count }))
      .slice(-14); // Últimos 14 dias com dados para não poluir
  }, [leads]);

  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
        Nenhum dado para o período selecionado
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 300, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>
        Tendência de Leads (Últimos dias)
      </h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-light)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: 'var(--primary-600)', fontWeight: 600 }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              name="Leads"
              stroke="var(--primary-500)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

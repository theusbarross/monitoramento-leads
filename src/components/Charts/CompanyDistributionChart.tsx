import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Lead } from '../../types';

interface CompanyDistributionChartProps {
  leads: Lead[];
}

export const CompanyDistributionChart: React.FC<CompanyDistributionChartProps> = ({ leads }) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    
    leads.forEach(lead => {
      if (!lead.empresa) return;
      counts[lead.empresa] = (counts[lead.empresa] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5
  }, [leads]);

  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
        Nenhum dado para o período selecionado
      </div>
    );
  }

  const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 300, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>
        Top Empresas
      </h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-light)" />
            <XAxis 
              type="number" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }} 
              width={100}
            />
            <Tooltip 
              cursor={{ fill: 'var(--bg-hover)' }}
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-light)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: 'var(--primary-600)', fontWeight: 600 }}
            />
            <Bar dataKey="count" name="Leads" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

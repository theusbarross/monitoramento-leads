import React, { useState, useEffect } from 'react';
import styles from './Filters.module.css';

interface FiltersProps {
  companies: string[];
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
}

type DatePreset = 'today' | 'last7days' | 'thisMonth' | 'custom';

export const Filters: React.FC<FiltersProps> = ({
  companies,
  selectedCompany,
  onCompanyChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}) => {
  const [preset, setPreset] = useState<DatePreset>('custom');

  // Atualizar o preset se as datas mudarem externamente (opcional, manter 'custom' como fallback)
  useEffect(() => {
    // Isso é útil se as datas forem inicializadas externamente
  }, [startDate, endDate]);

  const handlePresetChange = (newPreset: DatePreset) => {
    setPreset(newPreset);
    const today = new Date();
    
    // Função auxiliar para formatar a data como YYYY-MM-DD
    const formatDate = (date: Date) => {
      // Ajuste de timezone
      const d = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return d.toISOString().split('T')[0];
    };
    
    if (newPreset === 'today') {
      const todayStr = formatDate(today);
      onStartDateChange(todayStr);
      onEndDateChange(todayStr);
    } else if (newPreset === 'last7days') {
      const last7 = new Date(today);
      last7.setDate(today.getDate() - 6); // Hoje + 6 dias anteriores = 7 dias
      onStartDateChange(formatDate(last7));
      onEndDateChange(formatDate(today));
    } else if (newPreset === 'thisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      onStartDateChange(formatDate(firstDay));
      onEndDateChange(formatDate(lastDay));
    }
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <label htmlFor="company">Empresa</label>
        <div className={styles.selectWrapper}>
          <select 
            id="company" 
            value={selectedCompany} 
            onChange={(e) => onCompanyChange(e.target.value)}
            className={styles.select}
          >
            <option value="">Todas as Empresas</option>
            {companies.map(company => (
              <option key={company} value={company}>{company || 'Sem Empresa'}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label>Período</label>
        <div className={styles.presetButtons}>
          <button 
            className={`${styles.presetBtn} ${preset === 'today' ? styles.active : ''}`}
            onClick={() => handlePresetChange('today')}
          >
            Hoje
          </button>
          <button 
            className={`${styles.presetBtn} ${preset === 'last7days' ? styles.active : ''}`}
            onClick={() => handlePresetChange('last7days')}
          >
            Últimos 7 dias
          </button>
          <button 
            className={`${styles.presetBtn} ${preset === 'thisMonth' ? styles.active : ''}`}
            onClick={() => handlePresetChange('thisMonth')}
          >
            Este Mês
          </button>
          <button 
            className={`${styles.presetBtn} ${preset === 'custom' ? styles.active : ''}`}
            onClick={() => handlePresetChange('custom')}
          >
            Personalizado
          </button>
        </div>
      </div>

      {preset === 'custom' && (
        <div className={styles.customDatesGroup}>
          <div className={styles.dateInputWrapper}>
            <label htmlFor="startDate">Data Inicial</label>
            <input 
              type="date" 
              id="startDate" 
              value={startDate} 
              onChange={(e) => onStartDateChange(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.dateInputWrapper}>
            <label htmlFor="endDate">Data Final</label>
            <input 
              type="date" 
              id="endDate" 
              value={endDate} 
              onChange={(e) => onEndDateChange(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
      )}
    </div>
  );
};

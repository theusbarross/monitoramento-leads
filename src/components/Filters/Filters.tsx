import React from 'react';
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

export const Filters: React.FC<FiltersProps> = ({
  companies,
  selectedCompany,
  onCompanyChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}) => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <label htmlFor="company">Empresa</label>
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

      <div className={styles.filterGroup}>
        <label htmlFor="startDate">Data Inicial</label>
        <input 
          type="date" 
          id="startDate" 
          value={startDate} 
          onChange={(e) => onStartDateChange(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.filterGroup}>
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
  );
};

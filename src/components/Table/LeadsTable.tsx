import React, { useState } from 'react';
import styles from './LeadsTable.module.css';
import type { Lead } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { parseSheetDate } from '../../utils/formatters';

interface LeadsTableProps {
  leads: Lead[];
}

const PAGE_SIZE = 10;

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedLeads = React.useMemo(() => {
    return [...leads].sort((a, b) => {
      const dateA = parseSheetDate(a.dataHora).getTime();
      const dateB = parseSheetDate(b.dataHora).getTime();
      return dateB - dateA;
    });
  }, [leads]);

  const totalPages = Math.ceil(sortedLeads.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentLeads = sortedLeads.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Reseta a página se a lista de leads mudar (ex: ao filtrar)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [leads.length]);

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.title}>Últimos Leads Registrados</h3>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Empresa</th>
              <th>Telefone</th>
              <th>Data e Hora</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.length > 0 ? (
              currentLeads.map((lead, index) => (
                <tr key={lead.id || index}>
                  <td>
                    <div className={styles.leadName}>{lead.nome}</div>
                    {lead.cpf && <div className={styles.leadCpf}>CPF: {lead.cpf}</div>}
                  </td>
                  <td>
                    <span className={styles.badge}>{lead.empresa}</span>
                  </td>
                  <td className={styles.phone}>{lead.telefone || '-'}</td>
                  <td className={styles.date}>{lead.dataHora}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles.emptyState}>
                  Nenhum lead encontrado para os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Mostrando {startIndex + 1} até {Math.min(startIndex + PAGE_SIZE, leads.length)} de {leads.length}
          </span>
          <div className={styles.pageControls}>
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              <ChevronLeft size={18} />
            </button>
            <span className={styles.currentPage}>Página {currentPage} de {totalPages}</span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className={styles.pageBtn}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

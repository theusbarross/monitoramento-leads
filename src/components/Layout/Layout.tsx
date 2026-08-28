import React from 'react';
import styles from './Layout.module.css';
import { RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface LayoutProps {
  children: React.ReactNode;
  lastUpdated: Date | null;
  onRefresh: () => void;
  loading: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, lastUpdated, onRefresh, loading }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.jpg" alt="Logo" className={styles.logoImage} />
          <h1>Monitoramento de Leads</h1>
        </div>
        
        <div className={styles.actions}>
          {lastUpdated && (
            <span className={styles.lastUpdated}>
              Última atualização: {format(lastUpdated, 'HH:mm:ss')}
            </span>
          )}
          <button 
            className={styles.refreshBtn} 
            onClick={onRefresh}
            disabled={loading}
            title="Atualizar dados"
          >
            <RefreshCw className={loading ? styles.spin : ''} size={18} />
          </button>
        </div>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

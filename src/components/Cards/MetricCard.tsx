import React from 'react';
import styles from './MetricCard.module.css';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection,
  loading = false
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.iconWrapper}>
          <Icon size={20} className={styles.icon} />
        </div>
      </div>
      
      <div className={styles.content}>
        {loading ? (
          <div className={styles.skeleton}></div>
        ) : (
          <div className={styles.value}>{value}</div>
        )}
      </div>

      {trend && !loading && (
        <div className={`${styles.trend} ${trendDirection ? styles[trendDirection] : ''}`}>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

import { useState, useEffect, useCallback } from 'react';
import type { Lead } from '../types';
import { fetchLeads } from '../services/sheetsService';

interface UseLeadsDataResult {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
  isConfigured: boolean;
}

export const useLeadsData = (): UseLeadsDataResult => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeads();
      setLeads(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Polling a cada 30 segundos (ou outro intervalo desejado)
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadData]);

  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';
  const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID || '';

  const isConfigured = Boolean(apiKey && spreadsheetId);
  
  return { leads, loading, error, lastUpdated, refetch: loadData, isConfigured };
};

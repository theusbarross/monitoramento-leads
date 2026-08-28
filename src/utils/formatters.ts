import { parse } from 'date-fns';

export const maskCPF = (cpf: string) => {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf; // Fallback se o tamanho não bater
  return `***.***.${cleaned.substring(6, 9)}-**`;
};

export const formatCPF = (cpf: string) => {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9, 11)}`;
};

export const maskPhone = (phone: string) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const ddd = cleaned.substring(0, 2);
  const lastDigits = cleaned.substring(cleaned.length - 4);
  return `(${ddd}) *****-${lastDigits}`;
};

export const formatPhone = (phone: string) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
  }
  return phone;
};

// Converte a string "dd/MM/yyyy HH:mm" da planilha para um objeto Date do JS
export const parseSheetDate = (dateStr: string): Date => {
  try {
    if (dateStr.includes('T')) {
      return new Date(dateStr); // Se for ISO string (do fallback)
    }
    let parsed = parse(dateStr, 'dd/MM/yyyy HH:mm:ss', new Date());
    if (isNaN(parsed.getTime())) {
      parsed = parse(dateStr, 'dd/MM/yyyy HH:mm', new Date());
    }
    if (isNaN(parsed.getTime())) {
      parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    }

    if (isNaN(parsed.getTime())) {
      return new Date(); // Fallback se der Invalid Date
    }
    return parsed;
  } catch (e) {
    console.error('Erro ao fazer parse da data:', dateStr);
    return new Date();
  }
};

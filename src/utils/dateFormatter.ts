import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    
    if (!isValid(date)) {
      throw new Error('Invalid date');
    }

    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data não disponível';
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    
    if (!isValid(date)) {
      throw new Error('Invalid date');
    }

    return format(date, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return 'Data não disponível';
  }
};
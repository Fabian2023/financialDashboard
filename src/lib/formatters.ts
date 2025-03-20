
/**
 * Format number as Colombian Peso
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

/**
 * Format date as DD/MM/YYYY
 */
export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

/**
 * Format percentage with % symbol
 */
export const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
};

/**
 * Format month name in Spanish
 */
export const formatMonth = (date: Date): string => {
    return new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(date);
};

/**
 * Format month and year
 */
export const formatMonthYear = (date: Date): string => {
    return new Intl.DateTimeFormat('es-CO', { 
        month: 'long', 
        year: 'numeric' 
    }).format(date);
};

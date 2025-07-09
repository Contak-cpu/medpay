// Constantes de la aplicación
export const APP_CONFIG = {
  NAME: 'MedPay AI',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de Gestión de Pagos para Consultorios Médicos',
  AUTHOR: 'Tu Nombre',
  LICENSE: 'MIT'
} as const;

// Constantes de rutas
export const ROUTES = {
  HOME: '/',
  PROFESIONALES: '/profesionales',
  PAGOS: '/pagos',
  DASHBOARD: '/dashboard',
  DEUDAS: '/deudas',
  REPORTES: '/reportes'
} as const;

// Constantes de estados
export const ESTADOS_PAGO = {
  PENDIENTE: 'pendiente',
  PAGADO: 'pagado',
  RECIBIDA: 'recibida',
  COMPLETADA: 'completada'
} as const;

export const METODOS_PAGO = {
  EFECTIVO: 'efectivo',
  TRANSFERENCIA: 'transferencia'
} as const;

// Constantes de validación
export const VALIDATION_RULES = {
  NOMBRE_MIN_LENGTH: 2,
  NOMBRE_MAX_LENGTH: 100,
  ESPECIALIDAD_MIN_LENGTH: 2,
  ESPECIALIDAD_MAX_LENGTH: 50,
  PORCENTAJE_MIN: 1,
  PORCENTAJE_MAX: 100,
  VALOR_TURNO_MIN: 0,
  MONTO_MIN: 0,
  HORA_PATTERN: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
} as const;

// Constantes de UI
export const UI_CONFIG = {
  NOTIFICATION_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MOBILE_BREAKPOINT: 640,
  TABLET_BREAKPOINT: 1024
} as const;

// Constantes de analytics
export const ANALYTICS_EVENTS = {
  PROFESIONAL_ADDED: 'profesional_added',
  PROFESIONAL_UPDATED: 'profesional_updated',
  PROFESIONAL_DELETED: 'profesional_deleted',
  PAGO_ADDED: 'pago_added',
  PAGO_UPDATED: 'pago_updated',
  PAGO_DELETED: 'pago_deleted',
  PAGO_COMPLETED: 'pago_completed',
  REPORTE_EXPORTED: 'reporte_exported',
  DATA_CLEARED: 'data_cleared'
} as const;

// Constantes de performance
export const PERFORMANCE_THRESHOLDS = {
  LCP_GOOD: 2500,
  LCP_NEEDS_IMPROVEMENT: 4000,
  FID_GOOD: 100,
  FID_NEEDS_IMPROVEMENT: 300,
  CLS_GOOD: 0.1,
  CLS_NEEDS_IMPROVEMENT: 0.25
} as const;

// Constantes de test data
export const TEST_DATA_CONFIG = {
  DEFAULT_PROFESIONALES: 5,
  DEFAULT_PAGOS: 10,
  MAX_PROFESIONALES: 50,
  MAX_PAGOS: 1000
} as const;

// Constantes de exportación
export const EXPORT_CONFIG = {
  DEFAULT_FORMAT: 'csv',
  SUPPORTED_FORMATS: ['csv', 'xlsx'] as const,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  DEFAULT_FILENAME: 'reporte_medpay'
} as const;

// Constantes de seguridad
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  MAX_LOGIN_ATTEMPTS: 5,
  PASSWORD_MIN_LENGTH: 8,
  API_RATE_LIMIT: 100 // requests per minute
} as const;

// Constantes de base de datos
export const DB_CONFIG = {
  TABLES: {
    PROFESIONALES: 'profesionales',
    PAGOS: 'pagos',
    LOGS: 'logs'
  },
  INDEXES: {
    PROFESIONALES_NOMBRE: 'idx_profesionales_nombre',
    PAGOS_FECHA: 'idx_pagos_fecha',
    PAGOS_PROFESIONAL: 'idx_pagos_profesional_id'
  }
} as const; 
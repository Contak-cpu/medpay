// Tipos base
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at?: string;
}

// Tipos para profesionales
export interface Profesional extends BaseEntity {
  nombre: string;
  especialidad: string;
  porcentaje: number;
  valor_turno: number;
}

export interface ProfesionalFormData {
  nombre: string;
  especialidad: string;
  porcentaje: string;
  valorTurno: string;
}

// Tipos para pagos
export interface Pago extends BaseEntity {
  profesionalId: number;
  profesionalNombre: string;
  paciente: string;
  metodoPago: 'efectivo' | 'transferencia';
  fecha: string;
  hora: string;
  monto: number;
  porcentajeProfesional: number;
  gananciaProfesional: number;
  gananciaClinica: number;
  estado: 'pendiente' | 'pagado' | 'recibida' | 'completada';
  comprobante?: string | null;
  comprobanteClinica?: string | null;
  fechaPago?: string;
  esPagoParcial?: boolean;
  pagoOriginalId?: number;
}

export interface PagoFormData {
  profesionalId: string;
  paciente: string;
  metodoPago: 'efectivo' | 'transferencia';
  fecha: string;
  hora: string;
  monto: string;
  comprobante: string;
}

// Tipos para filtros
export interface Filtros {
  profesional: string;
  metodoPago: string;
  fechaDesde: string;
  fechaHasta: string;
  mostrarFiltros: boolean;
}

export interface FiltrosReportes {
  profesional: string;
  fechaDesde: string;
  fechaHasta: string;
  metodoPago: string;
  estado: string;
  rangoMonto: string;
  ordenar: string;
  mostrarFiltros: boolean;
}

// Tipos para estadísticas
export interface Estadisticas {
  totalEfectivoHoy: number;
  totalTransferenciaHoy: number;
  pagosHoy: number;
  totalEfectivoPendiente: number;
  totalComisionesPendientes: number;
  deudaPorProfesional: DeudaProfesional[];
}

export interface DeudaProfesional {
  id: number;
  nombre: string;
  efectivoPendiente: number;
  comisionPendiente: number;
  cantidadEfectivos: number;
  cantidadTransferencias: number;
}

// Tipos para reportes
export interface Reporte {
  totalEfectivo: number;
  totalTransferencias: number;
  totalGeneral: number;
  totalGananciasProfesionales: number;
  totalGananciasClinica: number;
  cantidadConsultas: number;
  reportePorProfesional: ReporteProfesional[];
  pagosFiltrados: Pago[];
}

export interface ReporteProfesional {
  id: number;
  nombre: string;
  especialidad: string;
  cantidadConsultas: number;
  totalFacturado: number;
  gananciaProfesional: number;
  gananciaClinica: number;
  efectivos: {
    cantidad: number;
    monto: number;
  };
  transferencias: {
    cantidad: number;
    monto: number;
  };
}

// Tipos para notificaciones
export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

// Tipos para logs
export interface Log extends BaseEntity {
  tipo: string;
  descripcion: string;
  datos: Record<string, any>;
}

// Tipos para hooks
export interface UseSupabaseConfig {
  setProfesionales?: (profesionales: Profesional[]) => void;
  setPagos?: (pagos: Pago[]) => void;
}

export interface UseSupabaseReturn {
  profesionales: Profesional[];
  pagos: Pago[];
  loading: boolean;
  error: string | null;
  addProfesional: (data: Omit<Profesional, 'id' | 'created_at'>) => Promise<Profesional>;
  updateProfesional: (id: number, updates: Partial<Profesional>) => Promise<Profesional>;
  deleteProfesional: (id: number) => Promise<void>;
  addPago: (data: Omit<Pago, 'id' | 'created_at'>) => Promise<Pago>;
  updatePago: (id: number, updates: Partial<Pago>) => Promise<void>;
  markPagoAsCompleted: (id: number, estado: string, comprobante?: string, comprobanteClinica?: string) => Promise<void>;
  deletePago: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  addLog: (tipo: string, descripcion: string, datos?: Record<string, any>) => Promise<void>;
  isTestMode: boolean;
  testDataHook?: any;
}

// Tipos para validación
export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    type?: 'string' | 'number' | 'email' | 'date';
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Tipos para componentes
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
}

// Tipos para analytics
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  category: string;
}

// Tipos para test data
export interface TestDataConfig {
  cantidadPagos?: number;
  cantidadProfesionales?: number;
  metodoPago?: 'efectivo' | 'transferencia' | 'mixto';
  incluirPagosPendientes?: boolean;
}

// Tipos para exportación
export interface ExportOptions {
  formato?: 'csv' | 'xlsx';
  secciones?: {
    resumen?: boolean;
    profesionales?: boolean;
    pagos?: boolean;
    estadisticas?: boolean;
  };
  filtros?: {
    incluirComprobantes?: boolean;
    incluirGanancias?: boolean;
    incluirEstados?: boolean;
    soloCompletados?: boolean;
  };
} 
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MedPayApp from '../../components/MedPayApp';

// Mock de los hooks
vi.mock('../../hooks/useSupabase', () => ({
  useSupabase: () => ({
    loading: false,
    error: null,
    profesionales: [],
    pagos: [],
    addProfesional: vi.fn(),
    updateProfesional: vi.fn(),
    addPago: vi.fn(),
    updatePago: vi.fn(),
    markPagoAsCompleted: vi.fn(),
    addLog: vi.fn(),
    clearAllData: vi.fn(),
    refreshData: vi.fn(),
    deleteProfesional: vi.fn(),
    deletePago: vi.fn(),
    isTestMode: true,
    testDataHook: {
      toggleTestMode: vi.fn(),
      clearTestData: vi.fn(),
      generateAdditionalTestData: vi.fn(),
      logs: []
    }
  })
}));

vi.mock('../../hooks/useValidation', () => ({
  default: () => ({
    validateForm: vi.fn(() => ({ isValid: true, errors: {} })),
    validateField: vi.fn(() => ''),
    clearErrors: vi.fn(),
    setFieldError: vi.fn(),
    clearFieldError: vi.fn()
  })
}));

vi.mock('../../hooks/useNotifications', () => ({
  default: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showWarning: vi.fn(),
    showInfo: vi.fn(),
    notifications: [],
    removeNotification: vi.fn()
  })
}));

vi.mock('../../hooks/useOptimizedCalculations', () => ({
  useOptimizedCalculations: () => ({
    estadisticas: {
      totalEfectivoHoy: 0,
      totalTransferenciaHoy: 0,
      pagosHoy: 0,
      totalEfectivoPendiente: 0,
      totalComisionesPendientes: 0,
      deudaPorProfesional: []
    },
    pagosFiltrados: [],
    reportes: {},
    calcularDetallesProfesional: vi.fn()
  })
}));

vi.mock('../../store/useMedPayStore', () => ({
  default: vi.fn(() => ({
    profesionales: [],
    pagos: [],
    filtros: {},
    filtrosReportes: {},
    setProfesionales: vi.fn(),
    setPagos: vi.fn(),
    setFiltros: vi.fn(),
    setFiltrosReportes: vi.fn()
  }))
}));

// Mock de los componentes
vi.mock('../../components/Navigation', () => ({
  default: ({ activeTab, setActiveTab }) => (
    <nav data-testid="navigation">
      <button onClick={() => setActiveTab('profesionales')}>Profesionales</button>
      <button onClick={() => setActiveTab('pagos')}>Pagos</button>
      <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
    </nav>
  )
}));

vi.mock('../../components/NotificationSystem', () => ({
  default: () => <div data-testid="notification-system" />
}));

describe('MedPayApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente sin errores', async () => {
    render(<MedPayApp />);
    
    await waitFor(() => {
      expect(screen.getByText('MedPay AI')).toBeInTheDocument();
    });
  });

  it('muestra el sistema de navegación', () => {
    render(<MedPayApp />);
    
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('muestra el sistema de notificaciones', () => {
    render(<MedPayApp />);
    
    expect(screen.getByTestId('notification-system')).toBeInTheDocument();
  });

  it('muestra la fecha actual', () => {
    render(<MedPayApp />);
    
    const today = new Date().toLocaleDateString('es-AR');
    expect(screen.getByText(today)).toBeInTheDocument();
  });

  it('tiene el botón de limpiar datos', () => {
    render(<MedPayApp />);
    
    expect(screen.getByText('Limpiar Datos')).toBeInTheDocument();
  });

  it('muestra el logo y título', () => {
    render(<MedPayApp />);
    
    expect(screen.getByText('MedPay AI')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Gestión de Pagos')).toBeInTheDocument();
  });
}); 
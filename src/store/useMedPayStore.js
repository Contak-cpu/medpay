import { create } from 'zustand';

const useMedPayStore = create((set, get) => ({
  profesionales: [],
  pagos: [],
  filtros: {
    profesional: '',
    metodoPago: '',
    fechaDesde: '',
    fechaHasta: '',
    mostrarFiltros: false
  },
  filtrosReportes: {
    profesional: '',
    fechaDesde: '',
    fechaHasta: '',
    metodoPago: '',
    estado: '',
    rangoMonto: '',
    ordenar: '',
    mesSeleccionado: '',
    mostrarFiltros: false
  },
  loading: false,
  error: null,
  // Acciones
  setProfesionales: (profesionales) => set({ profesionales }),
  setPagos: (pagos) => set({ pagos }),
  setFiltros: (filtros) => set({ filtros }),
  setFiltrosReportes: (filtrosReportes) => set({ filtrosReportes }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addProfesional: (prof) => set({ profesionales: [...get().profesionales, prof] }),
  updateProfesional: (id, data) => set({ profesionales: get().profesionales.map(p => p.id === id ? { ...p, ...data } : p) }),
  deleteProfesional: (id) => set({ profesionales: get().profesionales.filter(p => p.id !== id) }),
  addPago: (pago) => set({ pagos: [...get().pagos, pago] }),
  updatePago: (id, data) => set({ pagos: get().pagos.map(p => p.id === id ? { ...p, ...data } : p) }),
  deletePago: (id) => set({ pagos: get().pagos.filter(p => p.id !== id) }),
  clearAllData: () => set({ profesionales: [], pagos: [] }),
  refreshData: () => {}, // Se puede conectar con Supabase o testData
}));

export default useMedPayStore; 
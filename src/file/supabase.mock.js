// Mock de Supabase para desarrollo local

const STORAGE_KEY = 'medpay_mock_data_v1';

function loadData() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  return data || {
    profesionales: [],
    pagos: [],
    nextProfesionalId: 1,
    nextPagoId: 1
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const db = {
  async getProfesionales() {
    const data = loadData();
    return data.profesionales;
  },
  async createProfesional(profesional) {
    const data = loadData();
    const nuevo = { ...profesional, id: data.nextProfesionalId++ };
    data.profesionales.push(nuevo);
    saveData(data);
    return nuevo;
  },
  async updateProfesional(id, updates) {
    const data = loadData();
    const idx = data.profesionales.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Profesional no encontrado');
    data.profesionales[idx] = { ...data.profesionales[idx], ...updates };
    saveData(data);
    return data.profesionales[idx];
  },
  async deleteProfesional(id) {
    const data = loadData();
    data.profesionales = data.profesionales.filter(p => p.id !== id);
    saveData(data);
  },
  async getPagos() {
    const data = loadData();
    // Simular join con profesional
    return data.pagos.map(p => ({
      ...p,
      profesionalNombre: data.profesionales.find(prof => prof.id === p.profesionalId)?.nombre || 'Sin nombre',
      porcentajeProfesional: data.profesionales.find(prof => prof.id === p.profesionalId)?.porcentaje || 0,
    }));
  },
  async createPago(pago) {
    const data = loadData();
    const nuevo = { ...pago, id: data.nextPagoId++ };
    data.pagos.push(nuevo);
    saveData(data);
    return nuevo;
  },
  async updatePago(id, updates) {
    const data = loadData();
    const idx = data.pagos.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Pago no encontrado');
    data.pagos[idx] = { ...data.pagos[idx], ...updates };
    saveData(data);
    return data.pagos[idx];
  },
  async deletePago(id) {
    const data = loadData();
    data.pagos = data.pagos.filter(p => p.id !== id);
    saveData(data);
  },
  async clearAllData() {
    saveData({ profesionales: [], pagos: [], nextProfesionalId: 1, nextPagoId: 1 });
  }
}; 
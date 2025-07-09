import { useState, useEffect } from 'react';
import { shouldUseTestData } from '../config/environment';
import { getTestData, generateTestData } from '../data/testData';

// Funciones auxiliares para generar datos de testeo
const generateTestProfesionales = (cantidad) => {
  const especialidades = ['Cardiología', 'Dermatología', 'Neurología', 'Ortopedia', 'Pediatría', 'Ginecología', 'Oftalmología', 'Psiquiatría'];
  const nombres = ['Dr. García', 'Dr. Martínez', 'Dra. López', 'Dr. Rodríguez', 'Dra. Pérez', 'Dr. González', 'Dra. Fernández', 'Dr. Torres'];
  
  const profesionales = [];
  for (let i = 0; i < cantidad; i++) {
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const especialidad = especialidades[Math.floor(Math.random() * especialidades.length)];
    const porcentaje = Math.floor(Math.random() * 30) + 60; // 60-90%
    const valorTurno = Math.floor(Math.random() * 50000) + 20000; // $20k-$70k
    
    profesionales.push({
      id: Date.now() + i,
      nombre,
      especialidad,
      porcentaje,
      valor_turno: valorTurno,
      created_at: new Date().toISOString()
    });
  }
  
  return profesionales;
};

const generateTestPagos = (cantidad, opciones = {}) => {
  const { metodoPago = 'mixto', incluirPagosPendientes = true, profesionales = [] } = opciones;
  const pacientes = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez', 'Sofia Torres', 'Miguel González', 'Carmen Ruiz'];
  const metodos = metodoPago === 'mixto' ? ['efectivo', 'transferencia'] : [metodoPago];
  
  const pagos = [];
  for (let i = 0; i < cantidad; i++) {
    const profesional = profesionales[Math.floor(Math.random() * profesionales.length)] || {
      id: 1,
      nombre: 'Dr. Test',
      porcentaje: 70
    };
    
    const metodo = metodos[Math.floor(Math.random() * metodos.length)];
    const paciente = pacientes[Math.floor(Math.random() * pacientes.length)];
    const monto = Math.floor(Math.random() * 50000) + 15000; // $15k-$65k
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30)); // Últimos 30 días
    
    const estado = incluirPagosPendientes && Math.random() > 0.5 ? 
      (metodo === 'efectivo' ? 'pendiente' : 'recibida') : 
      (metodo === 'efectivo' ? 'pagado' : 'completada');
    
    pagos.push({
      id: Date.now() + i,
      profesionalId: profesional.id,
      profesionalNombre: profesional.nombre,
      paciente,
      metodoPago: metodo,
      fecha: fecha.toISOString().split('T')[0],
      hora: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      monto,
      porcentajeProfesional: profesional.porcentaje,
      gananciaProfesional: monto * (profesional.porcentaje / 100),
      gananciaClinica: monto * ((100 - profesional.porcentaje) / 100),
      estado,
      comprobante: Math.random() > 0.7 ? `COMP-${Math.floor(Math.random() * 10000)}` : null,
      comprobanteClinica: null,
      created_at: new Date().toISOString()
    });
  }
  
  return pagos;
};

export const useTestData = () => {
  const [testData, setTestData] = useState(getTestData());
  const [isTestMode, setIsTestMode] = useState(shouldUseTestData());

  // Función para alternar el modo de testeo
  const toggleTestMode = () => {
    const newMode = !isTestMode;
    setIsTestMode(newMode);
    console.log('🧪 TestData: Modo testeo cambiado a:', newMode);
  };

  // Función para agregar datos de testeo
  const addTestPago = (pagoData) => {
    if (!isTestMode) return;
    
    const newPago = {
      ...pagoData,
      id: testData.pagos.length + 1,
      created_at: new Date().toISOString()
    };
    
    setTestData(prev => ({
      ...prev,
      pagos: [...prev.pagos, newPago]
    }));
  };

  // Función para agregar profesional de testeo
  const addTestProfesional = (profesionalData) => {
    if (!isTestMode) return;
    
    const newProfesional = {
      ...profesionalData,
      id: testData.profesionales.length + 1,
      created_at: new Date().toISOString()
    };
    
    setTestData(prev => ({
      ...prev,
      profesionales: [...prev.profesionales, newProfesional]
    }));
  };

  // Función para actualizar profesional de testeo
  const updateTestProfesional = (id, updatedData) => {
    if (!isTestMode) return;
    
    setTestData(prev => ({
      ...prev,
      profesionales: prev.profesionales.map(prof => 
        prof.id === id ? { ...prof, ...updatedData } : prof
      )
    }));
  };

  // Función para eliminar profesional de testeo
  const deleteTestProfesional = (id) => {
    if (!isTestMode) return;
    
    setTestData(prev => ({
      ...prev,
      profesionales: prev.profesionales.filter(prof => prof.id !== id),
      pagos: prev.pagos.filter(pago => pago.profesionalId !== id)
    }));
  };

  // Función para eliminar pago de testeo
  const deleteTestPago = (id) => {
    if (!isTestMode) return;
    
    setTestData(prev => ({
      ...prev,
      pagos: prev.pagos.filter(pago => pago.id !== id)
    }));
  };

  // Función para actualizar estado de pago de testeo
  const updateTestPagoStatus = (id, newStatus, comprobanteProfesional = null, comprobanteClinica = null) => {
    if (!isTestMode) return;
    
    setTestData(prev => ({
      ...prev,
      pagos: prev.pagos.map(pago => 
        pago.id === id ? {
          ...pago,
          estado: newStatus,
          comprobante: comprobanteProfesional || pago.comprobante,
          comprobanteClinica: comprobanteClinica || pago.comprobanteClinica,
          fechaPago: new Date().toISOString()
        } : pago
      )
    }));
  };

  // Función para generar datos de testeo adicionales
  const generateAdditionalTestData = (opciones = {}) => {
    if (!isTestMode) return;
    
    const {
      cantidadPagos = 5,
      cantidadProfesionales = 0,
      metodoPago = 'mixto', // 'efectivo', 'transferencia', 'mixto'
      incluirPagosPendientes = true
    } = opciones;
    
    console.log('🧪 TestData: Generando datos adicionales:', opciones);
    
    // Generar profesionales adicionales si se solicita
    if (cantidadProfesionales > 0) {
      const nuevosProfesionales = generateTestProfesionales(cantidadProfesionales);
      setTestData(prev => ({
        ...prev,
        profesionales: [...prev.profesionales, ...nuevosProfesionales]
      }));
    }
    
    // Generar pagos adicionales
    if (cantidadPagos > 0) {
      const nuevosPagos = generateTestPagos(cantidadPagos, {
        metodoPago,
        incluirPagosPendientes,
        profesionales: testData.profesionales
      });
      
      setTestData(prev => ({
        ...prev,
        pagos: [...prev.pagos, ...nuevosPagos]
      }));
    }
  };

  // Función para limpiar todos los datos de testeo
  const clearTestData = () => {
    if (!isTestMode) return;
    
    console.log('🧪 TestData: Limpiando datos de testeo');
    const datosIniciales = getTestData();
    setTestData(datosIniciales);
    
    // Forzar actualización del estado
    setTimeout(() => {
      console.log('🧪 TestData: Datos limpiados, profesionales:', datosIniciales.profesionales.length, 'pagos:', datosIniciales.pagos.length);
    }, 0);
  };

  // Función para agregar log de testeo
  const addTestLog = (tipo, descripcion, datos = {}) => {
    if (!isTestMode) return;
    
    const newLog = {
      id: testData.logs.length + 1,
      tipo,
      descripcion,
      datos,
      created_at: new Date().toISOString()
    };
    
    setTestData(prev => ({
      ...prev,
      logs: [...prev.logs, newLog]
    }));
  };

  return {
    // Estado
    testData,
    isTestMode,
    
    // Funciones de control
    toggleTestMode,
    clearTestData,
    generateAdditionalTestData,
    
    // Funciones CRUD para profesionales
    addTestProfesional,
    updateTestProfesional,
    deleteTestProfesional,
    
    // Funciones CRUD para pagos
    addTestPago,
    deleteTestPago,
    updateTestPagoStatus,
    
    // Funciones para logs
    addTestLog,
    
    // Datos específicos
    profesionales: testData.profesionales,
    pagos: testData.pagos,
    logs: testData.logs
  };
}; 
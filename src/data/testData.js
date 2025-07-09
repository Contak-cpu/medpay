// Datos de testeo para desarrollo local
export const TEST_DATA = {
  // Profesionales de testeo
  profesionales: [
    {
      id: 1,
      nombre: "Dr. María González",
      especialidad: "Cardiología",
      porcentaje: 70,
      valor_turno: 15000,
      created_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      nombre: "Dr. Carlos Rodríguez",
      especialidad: "Dermatología",
      porcentaje: 65,
      valor_turno: 12000,
      created_at: "2024-01-16T14:30:00Z"
    },
    {
      id: 3,
      nombre: "Dra. Ana Martínez",
      especialidad: "Pediatría",
      porcentaje: 75,
      valor_turno: 10000,
      created_at: "2024-01-17T09:15:00Z"
    },
    {
      id: 4,
      nombre: "Dr. Luis Pérez",
      especialidad: "Ortopedia",
      porcentaje: 60,
      valor_turno: 18000,
      created_at: "2024-01-18T16:45:00Z"
    },
    {
      id: 5,
      nombre: "Dra. Sofia Herrera",
      especialidad: "Ginecología",
      porcentaje: 80,
      valor_turno: 20000,
      created_at: "2024-01-19T11:20:00Z"
    }
  ],

  // Pagos de testeo
  pagos: [
    {
      id: 1,
      profesionalId: 1,
      profesionalNombre: "Dr. María González",
      paciente: "Juan Pérez",
      metodoPago: "efectivo",
      fecha: "2024-01-20",
      hora: "09:00",
      monto: 15000,
      porcentajeProfesional: 70,
      gananciaProfesional: 10500,
      gananciaClinica: 4500,
      estado: "pendiente",
      comprobante: null,
      comprobanteClinica: null,
      created_at: "2024-01-20T09:00:00Z"
    },
    {
      id: 2,
      profesionalId: 1,
      profesionalNombre: "Dr. María González",
      paciente: "María López",
      metodoPago: "transferencia",
      fecha: "2024-01-20",
      hora: "10:30",
      monto: 15000,
      porcentajeProfesional: 70,
      gananciaProfesional: 10500,
      gananciaClinica: 4500,
      estado: "recibida",
      comprobante: "OP-2024-001",
      comprobanteClinica: null,
      created_at: "2024-01-20T10:30:00Z"
    },
    {
      id: 3,
      profesionalId: 2,
      profesionalNombre: "Dr. Carlos Rodríguez",
      paciente: "Pedro García",
      metodoPago: "efectivo",
      fecha: "2024-01-20",
      hora: "11:00",
      monto: 12000,
      porcentajeProfesional: 65,
      gananciaProfesional: 7800,
      gananciaClinica: 4200,
      estado: "pagado",
      comprobante: null,
      comprobanteClinica: null,
      created_at: "2024-01-20T11:00:00Z"
    },
    {
      id: 4,
      profesionalId: 2,
      profesionalNombre: "Dr. Carlos Rodríguez",
      paciente: "Laura Torres",
      metodoPago: "transferencia",
      fecha: "2024-01-21",
      hora: "14:00",
      monto: 12000,
      porcentajeProfesional: 65,
      gananciaProfesional: 7800,
      gananciaClinica: 4200,
      estado: "completada",
      comprobante: "OP-2024-002",
      comprobanteClinica: "TRF-2024-001",
      created_at: "2024-01-21T14:00:00Z"
    },
    {
      id: 5,
      profesionalId: 3,
      profesionalNombre: "Dra. Ana Martínez",
      paciente: "Carlos Ruiz",
      metodoPago: "efectivo",
      fecha: "2024-01-21",
      hora: "15:30",
      monto: 10000,
      porcentajeProfesional: 75,
      gananciaProfesional: 7500,
      gananciaClinica: 2500,
      estado: "pendiente",
      comprobante: null,
      comprobanteClinica: null,
      created_at: "2024-01-21T15:30:00Z"
    },
    {
      id: 6,
      profesionalId: 3,
      profesionalNombre: "Dra. Ana Martínez",
      paciente: "Sofia Mendoza",
      metodoPago: "efectivo",
      fecha: "2024-01-22",
      hora: "08:00",
      monto: 10000,
      porcentajeProfesional: 75,
      gananciaProfesional: 7500,
      gananciaClinica: 2500,
      estado: "pagado",
      comprobante: null,
      comprobanteClinica: null,
      created_at: "2024-01-22T08:00:00Z"
    },
    {
      id: 7,
      profesionalId: 4,
      profesionalNombre: "Dr. Luis Pérez",
      paciente: "Roberto Silva",
      metodoPago: "transferencia",
      fecha: "2024-01-22",
      hora: "16:00",
      monto: 18000,
      porcentajeProfesional: 60,
      gananciaProfesional: 10800,
      gananciaClinica: 7200,
      estado: "recibida",
      comprobante: "OP-2024-003",
      comprobanteClinica: null,
      created_at: "2024-01-22T16:00:00Z"
    },
    {
      id: 8,
      profesionalId: 5,
      profesionalNombre: "Dra. Sofia Herrera",
      paciente: "Carmen Vega",
      metodoPago: "efectivo",
      fecha: "2024-01-23",
      hora: "09:30",
      monto: 20000,
      porcentajeProfesional: 80,
      gananciaProfesional: 16000,
      gananciaClinica: 4000,
      estado: "pendiente",
      comprobante: null,
      comprobanteClinica: null,
      created_at: "2024-01-23T09:30:00Z"
    },
    {
      id: 9,
      profesionalId: 1,
      profesionalNombre: "Dr. María González",
      paciente: "Diego Morales",
      metodoPago: "transferencia",
      fecha: "2024-01-23",
      hora: "11:15",
      monto: 15000,
      porcentajeProfesional: 70,
      gananciaProfesional: 10500,
      gananciaClinica: 4500,
      estado: "completada",
      comprobante: "OP-2024-004",
      comprobanteClinica: "TRF-2024-002",
      created_at: "2024-01-23T11:15:00Z"
    },
    {
      id: 10,
      profesionalId: 2,
      profesionalNombre: "Dr. Carlos Rodríguez",
      paciente: "Patricia Castro",
      metodoPago: "efectivo",
      fecha: "2024-01-24",
      hora: "13:45",
      monto: 12000,
      porcentajeProfesional: 65,
      gananciaProfesional: 7800,
      gananciaClinica: 4200,
      estado: "pagado",
      comprobante: null,
      comprobanteClinica: null,
      created_at: "2024-01-24T13:45:00Z"
    }
  ],

  // Logs de testeo
  logs: [
    {
      id: 1,
      tipo: "profesional_agregado",
      descripcion: "Profesional Dr. María González agregado al sistema",
      datos: { profesionalId: 1, nombre: "Dr. María González" },
      created_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      tipo: "pago_registrado",
      descripcion: "Pago registrado para paciente Juan Pérez",
      datos: { pagoId: 1, monto: 15000, profesional: "Dr. María González" },
      created_at: "2024-01-20T09:00:00Z"
    },
    {
      id: 3,
      tipo: "pago_completado",
      descripcion: "Pago marcado como completado",
      datos: { pagoId: 3, estado: "pagado" },
      created_at: "2024-01-20T11:30:00Z"
    }
  ]
};

// Funciones de utilidad para datos de testeo
export const getTestData = () => {
  return TEST_DATA;
};

export const getTestProfesionales = () => {
  return TEST_DATA.profesionales;
};

export const getTestPagos = () => {
  return TEST_DATA.pagos;
};

export const getTestLogs = () => {
  return TEST_DATA.logs;
};

// Función para generar datos de testeo adicionales
export const generateTestData = (cantidad = 5) => {
  const nuevosPagos = [];
  const profesionales = getTestProfesionales();
  
  for (let i = 0; i < cantidad; i++) {
    const profesional = profesionales[Math.floor(Math.random() * profesionales.length)];
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30));
    
    const pago = {
      id: TEST_DATA.pagos.length + i + 1,
      profesionalId: profesional.id,
      profesionalNombre: profesional.nombre,
      paciente: `Paciente Test ${i + 1}`,
      metodoPago: Math.random() > 0.5 ? 'efectivo' : 'transferencia',
      fecha: fecha.toISOString().split('T')[0],
      hora: `${Math.floor(Math.random() * 12) + 8}:${Math.random() > 0.5 ? '00' : '30'}`,
      monto: Math.floor(Math.random() * 10000) + 5000,
      porcentajeProfesional: profesional.porcentaje,
      gananciaProfesional: 0, // Se calculará
      gananciaClinica: 0, // Se calculará
      estado: Math.random() > 0.7 ? 'pendiente' : 'pagado',
      comprobante: Math.random() > 0.5 ? `OP-TEST-${i + 1}` : null,
      comprobanteClinica: Math.random() > 0.8 ? `TRF-TEST-${i + 1}` : null,
      created_at: fecha.toISOString()
    };
    
    // Calcular ganancias
    pago.gananciaProfesional = pago.monto * (pago.porcentajeProfesional / 100);
    pago.gananciaClinica = pago.monto * ((100 - pago.porcentajeProfesional) / 100);
    
    nuevosPagos.push(pago);
  }
  
  return nuevosPagos;
}; 
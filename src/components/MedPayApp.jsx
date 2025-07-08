import React, { useState } from 'react';
import { Plus, User, CreditCard, DollarSign, Calendar, TrendingUp, Zap, Upload, Check, Clock, FileImage, X } from 'lucide-react';

const ConsultorioPagosApp = () => {
  const [activeTab, setActiveTab] = useState('profesionales');
  
  // Datos de prueba
  const datosDeEjemplo = {
    profesionales: [
      {
        id: 1,
        nombre: 'Dr. Juan Pérez',
        especialidad: 'Cardiología',
        porcentaje: 70,
        valorTurno: 15000
      },
      {
        id: 2,
        nombre: 'Dra. María González',
        especialidad: 'Neurología',
        porcentaje: 65,
        valorTurno: 18000
      },
      {
        id: 3,
        nombre: 'Dr. Carlos López',
        especialidad: 'Traumatología',
        porcentaje: 75,
        valorTurno: 12000
      }
    ],
    pagos: [
      {
        id: 1001,
        profesionalId: 1,
        profesionalNombre: 'Dr. Juan Pérez',
        paciente: 'Ana Martínez',
        metodoPago: 'efectivo',
        fecha: '2025-01-08',
        hora: '09:30',
        monto: 15000,
        porcentajeProfesional: 70,
        gananciaProfesional: 10500,
        gananciaClinica: 4500,
        estado: 'pendiente',
        comprobante: null,
        comprobanteClinica: null
      },
      {
        id: 1002,
        profesionalId: 2,
        profesionalNombre: 'Dra. María González',
        paciente: 'Roberto Silva',
        metodoPago: 'transferencia',
        fecha: '2025-01-08',
        hora: '10:15',
        monto: 18000,
        porcentajeProfesional: 65,
        gananciaProfesional: 11700,
        gananciaClinica: 6300,
        estado: 'recibida',
        comprobante: 'OP123456789',
        comprobanteClinica: null
      },
      {
        id: 1003,
        profesionalId: 1,
        profesionalNombre: 'Dr. Juan Pérez',
        paciente: 'Laura Fernández',
        metodoPago: 'transferencia',
        fecha: '2025-01-07',
        hora: '14:00',
        monto: 15000,
        porcentajeProfesional: 70,
        gananciaProfesional: 10500,
        gananciaClinica: 4500,
        estado: 'recibida',
        comprobante: null,
        comprobanteClinica: null
      },
      {
        id: 1004,
        profesionalId: 3,
        profesionalNombre: 'Dr. Carlos López',
        paciente: 'Miguel Rodríguez',
        metodoPago: 'efectivo',
        fecha: '2025-01-07',
        hora: '16:30',
        monto: 12000,
        porcentajeProfesional: 75,
        gananciaProfesional: 9000,
        gananciaClinica: 3000,
        estado: 'pagado',
        comprobante: null,
        comprobanteClinica: null,
        fechaPago: '2025-01-08T10:00:00.000Z'
      },
      {
        id: 1005,
        profesionalId: 2,
        profesionalNombre: 'Dra. María González',
        paciente: 'Sofia Herrera',
        metodoPago: 'transferencia',
        fecha: '2025-01-06',
        hora: '11:00',
        monto: 18000,
        porcentajeProfesional: 65,
        gananciaProfesional: 11700,
        gananciaClinica: 6300,
        estado: 'completada',
        comprobante: 'TRF987654321',
        comprobanteClinica: 'PAG456123',
        fechaPago: '2025-01-07T15:30:00.000Z'
      }
    ],
    logs: [
      {
        id: 2001,
        timestamp: '2025-01-08T09:00:00.000Z',
        tipo: 'profesional_agregado',
        descripcion: 'Profesional agregado: Dr. Juan Pérez',
        detalles: {
          especialidad: 'Cardiología',
          porcentaje: 70,
          valorTurno: 15000
        },
        usuario: 'Admin'
      },
      {
        id: 2002,
        timestamp: '2025-01-08T09:30:00.000Z',
        tipo: 'pago_registrado',
        descripcion: 'Pago registrado: Dr. Juan Pérez - Ana Martínez',
        detalles: {
          metodoPago: 'efectivo',
          monto: 15000,
          fecha: '2025-01-08',
          hora: '09:30'
        },
        usuario: 'Admin'
      }
    ]
  };
  
  const [profesionales, setProfesionales] = useState(datosDeEjemplo.profesionales);
  const [pagos, setPagos] = useState(datosDeEjemplo.pagos);
  const [logs, setLogs] = useState(datosDeEjemplo.logs);
  const [showAddProfesional, setShowAddProfesional] = useState(false);
  const [showNotification, setShowNotification] = useState('');
  const [showComprobanteModal, setShowComprobanteModal] = useState(false);
  const [pagoParaComprobar, setPagoParaComprobar] = useState(null);
  const [comprobantes, setComprobantes] = useState({
    profesional: '',
    clinica: ''
  });
  
  // Filtros para deudas
  const [filtros, setFiltros] = useState({
    profesional: '',
    metodoPago: '',
    fechaDesde: '',
    fechaHasta: '',
    mostrarFiltros: false
  });

  // Filtros para reportes
  const [filtrosReportes, setFiltrosReportes] = useState({
    profesional: '',
    fechaDesde: '',
    fechaHasta: '',
    mostrarFiltros: false
  });

  // Estado para vista detallada de profesional
  const [profesionalDetallado, setProfesionalDetallado] = useState(null);

  const [newProfesional, setNewProfesional] = useState({
    nombre: '',
    especialidad: '',
    porcentaje: '',
    valorTurno: ''
  });

  const [erroresProfesional, setErroresProfesional] = useState({
    nombre: '',
    especialidad: '',
    porcentaje: '',
    valorTurno: ''
  });

  const [newPago, setNewPago] = useState({
    profesionalId: '',
    paciente: '',
    metodoPago: 'efectivo',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    monto: '',
    comprobante: ''
  });

  // Función para agregar logs
  const addLog = (tipo, descripcion, detalles = {}) => {
    const log = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      tipo,
      descripcion,
      detalles,
      usuario: 'Admin' // Podrías hacer esto dinámico
    };
    setLogs(prev => [log, ...prev]);
  };

  // Funciones de validación
  const validarNombre = (nombre) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombre.trim()) {
      return 'El nombre es obligatorio';
    }
    if (nombre.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    if (!regex.test(nombre)) {
      return 'El nombre solo puede contener letras y espacios';
    }
    return '';
  };

  const validarEspecialidad = (especialidad) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!especialidad.trim()) {
      return 'La especialidad es obligatoria';
    }
    if (especialidad.trim().length < 2) {
      return 'La especialidad debe tener al menos 2 caracteres';
    }
    if (!regex.test(especialidad)) {
      return 'La especialidad solo puede contener letras y espacios';
    }
    return '';
  };

  const validarPorcentaje = (porcentaje) => {
    const num = parseFloat(porcentaje);
    if (!porcentaje) {
      return 'El porcentaje es obligatorio';
    }
    if (isNaN(num) || num <= 0 || num > 100) {
      return 'El porcentaje debe ser un número entre 1 y 100';
    }
    return '';
  };

  const validarValorTurno = (valorTurno) => {
    const num = parseFloat(valorTurno);
    if (!valorTurno) {
      return 'El valor del turno es obligatorio';
    }
    if (isNaN(num) || num <= 0) {
      return 'El valor del turno debe ser un número mayor a 0';
    }
    return '';
  };

  // Función para validar el profesional completo
  const validarProfesionalCompleto = () => {
    const errores = {
      nombre: validarNombre(newProfesional.nombre),
      especialidad: validarEspecialidad(newProfesional.especialidad),
      porcentaje: validarPorcentaje(newProfesional.porcentaje),
      valorTurno: validarValorTurno(newProfesional.valorTurno)
    };
    
    setErroresProfesional(errores);
    
    // Retorna true si no hay errores
    return !Object.values(errores).some(error => error !== '');
  };

  // Mostrar notificación
  const showSuccessNotification = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 3000);
  };

  const handleAddProfesional = () => {
    if (validarProfesionalCompleto()) {
      const profesional = {
        id: Date.now(),
        nombre: newProfesional.nombre.trim(),
        especialidad: newProfesional.especialidad.trim(),
        porcentaje: parseFloat(newProfesional.porcentaje),
        valorTurno: parseFloat(newProfesional.valorTurno)
      };
      setProfesionales([...profesionales, profesional]);
      
      // Agregar log
      addLog('profesional_agregado', `Profesional agregado: ${profesional.nombre}`, {
        especialidad: profesional.especialidad,
        porcentaje: profesional.porcentaje,
        valorTurno: profesional.valorTurno
      });
      
      setNewProfesional({ nombre: '', especialidad: '', porcentaje: '', valorTurno: '' });
      setErroresProfesional({ nombre: '', especialidad: '', porcentaje: '', valorTurno: '' });
      setShowAddProfesional(false);
      showSuccessNotification('Profesional agregado con éxito');
    }
  };

  const handleAddPago = () => {
    if (newPago.profesionalId && newPago.paciente && newPago.monto) {
      const profesional = profesionales.find(p => p.id === parseInt(newPago.profesionalId));
      const monto = parseFloat(newPago.monto);
      
      const pago = {
        id: Date.now(),
        profesionalId: parseInt(newPago.profesionalId),
        profesionalNombre: profesional.nombre,
        paciente: newPago.paciente,
        metodoPago: newPago.metodoPago,
        fecha: newPago.fecha,
        hora: newPago.hora,
        monto: monto,
        porcentajeProfesional: profesional.porcentaje,
        gananciaProfesional: monto * (profesional.porcentaje / 100),
        gananciaClinica: monto * ((100 - profesional.porcentaje) / 100),
        estado: newPago.metodoPago === 'efectivo' ? 'pendiente' : 'recibida',
        comprobante: newPago.comprobante || null,
        comprobanteClinica: null
      };
      
      setPagos([...pagos, pago]);
      
      // Agregar log
      addLog('pago_registrado', `Pago registrado: ${profesional.nombre} - ${newPago.paciente}`, {
        metodoPago: newPago.metodoPago,
        monto: monto,
        fecha: newPago.fecha,
        hora: newPago.hora,
        tieneComprobante: !!newPago.comprobante
      });
      
      setNewPago({
        profesionalId: '',
        paciente: '',
        metodoPago: 'efectivo',
        fecha: new Date().toISOString().split('T')[0],
        hora: '09:00',
        monto: '',
        comprobante: ''
      });
      
      showSuccessNotification('Pago registrado con éxito');
    }
  };

  // Marcar pago individual como pagado
  const marcarPagoIndividual = (pagoId, tipo) => {
    if (tipo === 'transferencia') {
      // Mostrar modal para pedir comprobantes
      setPagoParaComprobar({ id: pagoId, tipo });
      setComprobantes({ profesional: '', clinica: '' });
      setShowComprobanteModal(true);
    } else {
      // Para efectivo, marcar directamente
      completarMarcadoPago(pagoId, tipo, null, null);
    }
  };

  // Función para completar el marcado de pago con los comprobantes
  const completarMarcadoPago = (pagoId, tipo, comprobanteProfesional, comprobanteClinica) => {
    setPagos(pagos.map(pago => {
      if (pago.id === pagoId) {
        const nuevoEstado = tipo === 'efectivo' ? 'pagado' : 'completada';
        
        // Agregar log
        addLog('pago_marcado', `Pago marcado como ${nuevoEstado}: ${pago.profesionalNombre} - ${pago.paciente}`, {
          metodoPago: pago.metodoPago,
          monto: pago.monto,
          estadoAnterior: pago.estado,
          estadoNuevo: nuevoEstado,
          tieneComprobanteProfesional: !!comprobanteProfesional,
          tieneComprobanteClinica: !!comprobanteClinica
        });
        
        return {
          ...pago, 
          estado: nuevoEstado, 
          fechaPago: new Date().toISOString(), 
          comprobante: comprobanteProfesional || pago.comprobante,
          comprobanteClinica
        };
      }
      return pago;
    }));
    
    showSuccessNotification('Pago marcado como completado');
  };

  // Función para confirmar comprobantes desde el modal
  const confirmarComprobantes = () => {
    completarMarcadoPago(
      pagoParaComprobar.id, 
      pagoParaComprobar.tipo, 
      comprobantes.profesional || null, 
      comprobantes.clinica || null
    );
    setShowComprobanteModal(false);
    setPagoParaComprobar(null);
    setComprobantes({ profesional: '', clinica: '' });
  };

  const marcarEfectivoPagado = (profesionalId) => {
    const pagosAfectados = pagos.filter(p => 
      p.profesionalId === profesionalId && 
      p.metodoPago === 'efectivo' && 
      p.estado === 'pendiente'
    );
    
    setPagos(pagos.map(pago => 
      pago.profesionalId === profesionalId && 
      pago.metodoPago === 'efectivo' && 
      pago.estado === 'pendiente'
        ? {...pago, estado: 'pagado', fechaPago: new Date().toISOString()}
        : pago
    ));
    
    // Agregar log
    addLog('pagos_masivos', `Marcados ${pagosAfectados.length} pagos en efectivo como pagados para profesional`, {
      profesionalId,
      cantidadPagos: pagosAfectados.length,
      montoTotal: pagosAfectados.reduce((sum, p) => sum + p.gananciaProfesional, 0)
    });
  };

  const marcarTransferenciasCobradas = (profesionalId) => {
    const pagosAfectados = pagos.filter(p => 
      p.profesionalId === profesionalId && 
      p.metodoPago === 'transferencia' && 
      p.estado === 'recibida'
    );
    
    // Verificar si alguno no tiene comprobante del profesional
    const sinComprobante = pagosAfectados.some(p => !p.comprobante);
    let comprobanteProfesional = null;
    
    if (sinComprobante) {
      comprobanteProfesional = prompt('Algunos pagos no tienen comprobante del profesional. Ingresa uno general (opcional):');
    }
    
    const comprobanteClinica = prompt('Ingresa el comprobante de pago de la clínica (opcional):');
    
    setPagos(pagos.map(pago => 
      pago.profesionalId === profesionalId && 
      pago.metodoPago === 'transferencia' && 
      pago.estado === 'recibida'
        ? {
            ...pago, 
            estado: 'completada', 
            fechaPago: new Date().toISOString(), 
            comprobante: pago.comprobante || comprobanteProfesional,
            comprobanteClinica: comprobanteClinica || null
          }
        : pago
    ));
    
    // Agregar log
    addLog('comisiones_cobradas', `Marcadas ${pagosAfectados.length} comisiones de transferencia como cobradas para profesional`, {
      profesionalId,
      cantidadPagos: pagosAfectados.length,
      montoTotal: pagosAfectados.reduce((sum, p) => sum + p.gananciaClinica, 0),
      tieneComprobanteProfesional: !!comprobanteProfesional,
      tieneComprobanteClinica: !!comprobanteClinica
    });
    
    showSuccessNotification('Comisiones marcadas como cobradas');
  };

  // Función para aplicar filtros a los pagos
  const aplicarFiltros = (pagosList) => {
    return pagosList.filter(pago => {
      let cumpleFiltros = true;
      
      if (filtros.profesional && pago.profesionalId !== parseInt(filtros.profesional)) {
        cumpleFiltros = false;
      }
      
      if (filtros.metodoPago && pago.metodoPago !== filtros.metodoPago) {
        cumpleFiltros = false;
      }
      
      if (filtros.fechaDesde && pago.fecha < filtros.fechaDesde) {
        cumpleFiltros = false;
      }
      
      if (filtros.fechaHasta && pago.fecha > filtros.fechaHasta) {
        cumpleFiltros = false;
      }
      
      return cumpleFiltros;
    });
  };

  // Función para aplicar filtros de reportes
  const aplicarFiltrosReportes = (pagosList) => {
    return pagosList.filter(pago => {
      let cumpleFiltros = true;
      
      if (filtrosReportes.profesional && pago.profesionalId !== parseInt(filtrosReportes.profesional)) {
        cumpleFiltros = false;
      }
      
      if (filtrosReportes.fechaDesde && pago.fecha < filtrosReportes.fechaDesde) {
        cumpleFiltros = false;
      }
      
      if (filtrosReportes.fechaHasta && pago.fecha > filtrosReportes.fechaHasta) {
        cumpleFiltros = false;
      }
      
      return cumpleFiltros;
    });
  };

  // Función para calcular estadísticas de reportes
  const calcularReportes = () => {
    const pagosFiltrados = aplicarFiltrosReportes(pagos);
    
    // Estadísticas generales
    const totalEfectivo = pagosFiltrados.filter(p => p.metodoPago === 'efectivo').reduce((sum, p) => sum + p.monto, 0);
    const totalTransferencias = pagosFiltrados.filter(p => p.metodoPago === 'transferencia').reduce((sum, p) => sum + p.monto, 0);
    const totalGeneral = totalEfectivo + totalTransferencias;
    
    // Ganancias de profesionales
    const totalGananciasProfesionales = pagosFiltrados.reduce((sum, p) => sum + p.gananciaProfesional, 0);
    
    // Ganancias de la clínica
    const totalGananciasClinica = pagosFiltrados.reduce((sum, p) => sum + p.gananciaClinica, 0);
    
    // Estadísticas por profesional
    const reportePorProfesional = profesionales.map(prof => {
      const pagosProf = pagosFiltrados.filter(p => p.profesionalId === prof.id);
      const efectivos = pagosProf.filter(p => p.metodoPago === 'efectivo');
      const transferencias = pagosProf.filter(p => p.metodoPago === 'transferencia');
      
      return {
        id: prof.id,
        nombre: prof.nombre,
        especialidad: prof.especialidad,
        cantidadConsultas: pagosProf.length,
        totalFacturado: pagosProf.reduce((sum, p) => sum + p.monto, 0),
        gananciaProfesional: pagosProf.reduce((sum, p) => sum + p.gananciaProfesional, 0),
        gananciaClinica: pagosProf.reduce((sum, p) => sum + p.gananciaClinica, 0),
        efectivos: {
          cantidad: efectivos.length,
          monto: efectivos.reduce((sum, p) => sum + p.monto, 0)
        },
        transferencias: {
          cantidad: transferencias.length,
          monto: transferencias.reduce((sum, p) => sum + p.monto, 0)
        }
      };
    }).filter(r => r.cantidadConsultas > 0);
    
    return {
      totalEfectivo,
      totalTransferencias,
      totalGeneral,
      totalGananciasProfesionales,
      totalGananciasClinica,
      cantidadConsultas: pagosFiltrados.length,
      reportePorProfesional,
      pagosFiltrados
    };
  };

  // Función para calcular estadísticas detalladas de un profesional
  const calcularDetallesProfesional = (profesionalId) => {
    const profesional = profesionales.find(p => p.id === profesionalId);
    if (!profesional) return null;

    const pagosProfesional = aplicarFiltrosReportes(pagos).filter(p => p.profesionalId === profesionalId);
    
    // Agrupar por estado
    const pagosCompletados = pagosProfesional.filter(p => p.estado === 'pagado' || p.estado === 'completada');
    const pagosPendientes = pagosProfesional.filter(p => p.estado === 'pendiente' || p.estado === 'recibida');
    
    // Estadísticas por método
    const efectivos = pagosProfesional.filter(p => p.metodoPago === 'efectivo');
    const transferencias = pagosProfesional.filter(p => p.metodoPago === 'transferencia');
    
    // Estadísticas temporales
    const fechas = [...new Set(pagosProfesional.map(p => p.fecha))].sort();
    const primerPago = fechas[0];
    const ultimoPago = fechas[fechas.length - 1];
    
    // Calcular días activos
    const diasActivos = fechas.length;
    const diasTranscurridos = primerPago && ultimoPago ? 
      Math.ceil((new Date(ultimoPago) - new Date(primerPago)) / (1000 * 60 * 60 * 24)) + 1 : 1;
    
    // Estadísticas de pagos
    const totalFacturado = pagosProfesional.reduce((sum, p) => sum + p.monto, 0);
    const totalGanado = pagosProfesional.reduce((sum, p) => sum + p.gananciaProfesional, 0);
    const totalComisiones = pagosProfesional.reduce((sum, p) => sum + p.gananciaClinica, 0);
    
    // Pendientes
    const efectivosPendientes = pagosPendientes.filter(p => p.metodoPago === 'efectivo');
    const transferenciasPendientes = pagosPendientes.filter(p => p.metodoPago === 'transferencia');
    
    return {
      profesional,
      pagosProfesional,
      estadisticas: {
        totalConsultas: pagosProfesional.length,
        totalFacturado,
        totalGanado,
        totalComisiones,
        promedioPorConsulta: pagosProfesional.length > 0 ? totalFacturado / pagosProfesional.length : 0,
        diasActivos,
        diasTranscurridos,
        consultasPorDia: diasTranscurridos > 0 ? pagosProfesional.length / diasTranscurridos : 0,
        metodosPreferidos: {
          efectivo: {
            cantidad: efectivos.length,
            monto: efectivos.reduce((sum, p) => sum + p.monto, 0),
            porcentaje: pagosProfesional.length > 0 ? (efectivos.length / pagosProfesional.length) * 100 : 0
          },
          transferencia: {
            cantidad: transferencias.length,
            monto: transferencias.reduce((sum, p) => sum + p.monto, 0),
            porcentaje: pagosProfesional.length > 0 ? (transferencias.length / pagosProfesional.length) * 100 : 0
          }
        }
      },
      pendientes: {
        efectivos: efectivosPendientes.reduce((sum, p) => sum + p.gananciaProfesional, 0),
        transferencias: transferenciasPendientes.reduce((sum, p) => sum + p.gananciaClinica, 0),
        cantidadEfectivos: efectivosPendientes.length,
        cantidadTransferencias: transferenciasPendientes.length
      },
      actividad: {
        primerPago,
        ultimoPago,
        pagosCompletados: pagosCompletados.length,
        pagosPendientes: pagosPendientes.length
      }
    };
  };
  const exportarReporteCSV = () => {
    const reportes = calcularReportes();
    
    // Crear contenido CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header del resumen general
    csvContent += "RESUMEN GENERAL\n";
    csvContent += "Concepto,Monto,Cantidad\n";
    csvContent += `Total Facturado,${reportes.totalGeneral.toLocaleString()},${reportes.cantidadConsultas} consultas\n`;
    csvContent += `Ganancias Profesionales,${reportes.totalGananciasProfesionales.toLocaleString()},-\n`;
    csvContent += `Ganancias Clínica,${reportes.totalGananciasClinica.toLocaleString()},-\n`;
    csvContent += `Efectivo,${reportes.totalEfectivo.toLocaleString()},-\n`;
    csvContent += `Transferencias,${reportes.totalTransferencias.toLocaleString()},-\n`;
    csvContent += "\n";
    
    // Header del reporte por profesional
    csvContent += "REPORTE POR PROFESIONAL\n";
    csvContent += "Nombre,Especialidad,Consultas,Total Facturado,Ganancia Profesional,Ganancia Clínica,Efectivos Cant,Efectivos Monto,Transferencias Cant,Transferencias Monto\n";
    
    // Datos por profesional
    reportes.reportePorProfesional.forEach(prof => {
      csvContent += `"${prof.nombre}","${prof.especialidad}",${prof.cantidadConsultas},${prof.totalFacturado},${prof.gananciaProfesional},${prof.gananciaClinica},${prof.efectivos.cantidad},${prof.efectivos.monto},${prof.transferencias.cantidad},${prof.transferencias.monto}\n`;
    });
    
    csvContent += "\n";
    
    // Header del detalle de pagos
    csvContent += "DETALLE DE PAGOS\n";
    csvContent += "Fecha,Hora,Profesional,Paciente,Método Pago,Monto,Ganancia Profesional,Ganancia Clínica,Estado\n";
    
    // Datos de pagos individuales
    reportes.pagosFiltrados.forEach(pago => {
      csvContent += `${pago.fecha},${pago.hora},"${pago.profesionalNombre}","${pago.paciente}",${pago.metodoPago},${pago.monto},${pago.gananciaProfesional},${pago.gananciaClinica},${pago.estado}\n`;
    });
    
    // Crear y descargar archivo
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    // Generar nombre del archivo con fecha actual
    const fechaActual = new Date().toISOString().split('T')[0];
    const filtroTexto = filtrosReportes.profesional ? 
      `_${profesionales.find(p => p.id === parseInt(filtrosReportes.profesional))?.nombre.replace(/\s+/g, '_')}` : '';
    const rangoFecha = filtrosReportes.fechaDesde && filtrosReportes.fechaHasta ? 
      `_${filtrosReportes.fechaDesde}_a_${filtrosReportes.fechaHasta}` : '';
    
    link.setAttribute("download", `reporte_medpay_${fechaActual}${filtroTexto}${rangoFecha}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log de la exportación
    addLog('reporte_exportado', 'Reporte exportado a CSV', {
      totalRegistros: reportes.pagosFiltrados.length,
      profesionales: reportes.reportePorProfesional.length,
      montoTotal: reportes.totalGeneral,
      filtros: filtrosReportes
    });
    
    showSuccessNotification('Reporte exportado con éxito');
  };

  const calcularEstadisticas = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const pagosHoy = pagos.filter(p => p.fecha === hoy);
    
    // Aplicar filtros a todos los pagos para el cálculo de deudas
    const pagosFiltrados = aplicarFiltros(pagos);
    
    const efectivoPendiente = pagosFiltrados.filter(p => p.metodoPago === 'efectivo' && p.estado === 'pendiente');
    const transferenciasPendientes = pagosFiltrados.filter(p => p.metodoPago === 'transferencia' && p.estado === 'recibida');
    
    return {
      totalEfectivoHoy: pagosHoy.filter(p => p.metodoPago === 'efectivo').reduce((sum, p) => sum + p.monto, 0),
      totalTransferenciaHoy: pagosHoy.filter(p => p.metodoPago === 'transferencia').reduce((sum, p) => sum + p.monto, 0),
      pagosHoy: pagosHoy.length,
      totalEfectivoPendiente: efectivoPendiente.reduce((sum, p) => sum + p.gananciaProfesional, 0),
      totalComisionesPendientes: transferenciasPendientes.reduce((sum, p) => sum + p.gananciaClinica, 0),
      deudaPorProfesional: profesionales.map(prof => {
        const efectivosPendientes = efectivoPendiente.filter(p => p.profesionalId === prof.id);
        const transferenciasRecibidas = transferenciasPendientes.filter(p => p.profesionalId === prof.id);
        
        return {
          id: prof.id,
          nombre: prof.nombre,
          efectivoPendiente: efectivosPendientes.reduce((sum, p) => sum + p.gananciaProfesional, 0),
          comisionPendiente: transferenciasRecibidas.reduce((sum, p) => sum + p.gananciaClinica, 0),
          cantidadEfectivos: efectivosPendientes.length,
          cantidadTransferencias: transferenciasRecibidas.length
        };
      }).filter(d => d.efectivoPendiente > 0 || d.comisionPendiente > 0)
    };
  };

  const stats = calcularEstadisticas();

  const getEstadoColor = (pago) => {
    if (pago.metodoPago === 'efectivo') {
      return pago.estado === 'pendiente' ? 'bg-orange-500' : 'bg-green-500';
    } else {
      return pago.estado === 'recibida' ? 'bg-blue-500' : 'bg-green-500';
    }
  };

  const getEstadoTexto = (pago) => {
    if (pago.metodoPago === 'efectivo') {
      return pago.estado === 'pendiente' ? 'Debe pagar clínica' : 'Pagado';
    } else {
      return pago.estado === 'recibida' ? 'Comisión pendiente' : 'Completado';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  MedPay AI
                </h1>
                <p className="text-purple-300 text-sm">Sistema de Gestión de Pagos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que quieres limpiar todos los datos? Esta acción no se puede deshacer.')) {
                    setProfesionales([]);
                    setPagos([]);
                    setLogs([]);
                    showSuccessNotification('Datos limpiados correctamente');
                  }
                }}
                className="bg-red-600/20 hover:bg-red-600/30 px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 border border-red-500/30"
              >
                <X className="w-3 h-3" />
                <span>Limpiar Datos</span>
              </button>
              <div className="text-right">
                <p className="text-sm text-purple-300">Hoy</p>
                <p className="text-lg font-semibold">{new Date().toLocaleDateString('es-AR')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black/10 backdrop-blur-md border-b border-purple-500/10">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profesionales')}
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all ${
                activeTab === 'profesionales' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-300 hover:text-purple-300'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profesionales</span>
            </button>
            
            <button
              onClick={() => setActiveTab('registro')}
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all ${
                activeTab === 'registro' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-300 hover:text-purple-300'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Registro de Pagos</span>
            </button>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all ${
                activeTab === 'dashboard' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-300 hover:text-purple-300'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveTab('deudas')}
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all ${
                activeTab === 'deudas' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-300 hover:text-purple-300'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Estado de Deudas</span>
            </button>
            
            <button
              onClick={() => setActiveTab('reportes')}
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all ${
                activeTab === 'reportes' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-300 hover:text-purple-300'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Reportes</span>
            </button>
            
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all ${
                activeTab === 'logs' ? 'border-purple-400 text-purple-400' : 'border-transparent text-gray-300 hover:text-purple-300'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Logs</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Notificación de éxito */}
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>{showNotification}</span>
            </div>
          </div>
        )}
        {/* Tab: Profesionales */}
        {activeTab === 'profesionales' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Gestión de Profesionales
              </h2>
              <button
                onClick={() => setShowAddProfesional(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Profesional</span>
              </button>
            </div>

            {showAddProfesional && (
              <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
                <h3 className="text-xl font-semibold mb-6 text-purple-300">Nuevo Profesional</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={newProfesional.nombre}
                        onChange={(e) => {
                          setNewProfesional({...newProfesional, nombre: e.target.value});
                          setErroresProfesional({...erroresProfesional, nombre: validarNombre(e.target.value)});
                        }}
                        className={`w-full px-4 py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white ${
                          erroresProfesional.nombre ? 'border-red-500 focus:border-red-400' : 'border-purple-500/30 focus:border-purple-400'
                        }`}
                        placeholder="Dr. Juan Pérez"
                      />
                      {erroresProfesional.nombre && (
                        <p className="text-red-400 text-xs mt-1">{erroresProfesional.nombre}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Especialidad
                      </label>
                      <input
                        type="text"
                        value={newProfesional.especialidad}
                        onChange={(e) => {
                          setNewProfesional({...newProfesional, especialidad: e.target.value});
                          setErroresProfesional({...erroresProfesional, especialidad: validarEspecialidad(e.target.value)});
                        }}
                        className={`w-full px-4 py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white ${
                          erroresProfesional.especialidad ? 'border-red-500 focus:border-red-400' : 'border-purple-500/30 focus:border-purple-400'
                        }`}
                        placeholder="Cardiología"
                      />
                      {erroresProfesional.especialidad && (
                        <p className="text-red-400 text-xs mt-1">{erroresProfesional.especialidad}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Porcentaje del Profesional (%)
                      </label>
                      <input
                        type="number"
                        value={newProfesional.porcentaje}
                        onChange={(e) => {
                          setNewProfesional({...newProfesional, porcentaje: e.target.value});
                          setErroresProfesional({...erroresProfesional, porcentaje: validarPorcentaje(e.target.value)});
                        }}
                        className={`w-full px-4 py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white ${
                          erroresProfesional.porcentaje ? 'border-red-500 focus:border-red-400' : 'border-purple-500/30 focus:border-purple-400'
                        }`}
                        placeholder="70"
                        min="1"
                        max="100"
                      />
                      {erroresProfesional.porcentaje && (
                        <p className="text-red-400 text-xs mt-1">{erroresProfesional.porcentaje}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Valor del Turno ($)
                      </label>
                      <input
                        type="number"
                        value={newProfesional.valorTurno}
                        onChange={(e) => {
                          setNewProfesional({...newProfesional, valorTurno: e.target.value});
                          setErroresProfesional({...erroresProfesional, valorTurno: validarValorTurno(e.target.value)});
                        }}
                        className={`w-full px-4 py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white ${
                          erroresProfesional.valorTurno ? 'border-red-500 focus:border-red-400' : 'border-purple-500/30 focus:border-purple-400'
                        }`}
                        placeholder="15000"
                        min="1"
                      />
                      {erroresProfesional.valorTurno && (
                        <p className="text-red-400 text-xs mt-1">{erroresProfesional.valorTurno}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddProfesional}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8 py-3 rounded-xl font-semibold transition-all"
                    >
                      Agregar Profesional
                    </button>
                    <button
                      onClick={() => setShowAddProfesional(false)}
                      className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-xl font-semibold transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profesionales.map(profesional => (
                <div key={profesional.id} className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{profesional.nombre}</h3>
                      <p className="text-purple-300 text-sm">{profesional.especialidad}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Porcentaje:</span>
                      <span className="text-purple-400 font-semibold">{profesional.porcentaje}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Valor turno:</span>
                      <span className="text-green-400 font-semibold">${profesional.valorTurno.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Ganancia por turno:</span>
                      <span className="text-blue-400 font-semibold">${(profesional.valorTurno * profesional.porcentaje / 100).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Registro de Pagos */}
        {activeTab === 'registro' && (
          <div className="space-y-8">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Registrar Nuevo Pago
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Profesional
                    </label>
                    <select
                      value={newPago.profesionalId}
                      onChange={(e) => setNewPago({...newPago, profesionalId: e.target.value})}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
                    >
                      <option value="">Seleccionar profesional</option>
                      {profesionales.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} - {p.especialidad}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Paciente
                    </label>
                    <input
                      type="text"
                      value={newPago.paciente}
                      onChange={(e) => setNewPago({...newPago, paciente: e.target.value})}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
                      placeholder="Nombre del paciente"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Método de Pago
                    </label>
                    <select
                      value={newPago.metodoPago}
                      onChange={(e) => setNewPago({...newPago, metodoPago: e.target.value})}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
                    >
                      <option value="efectivo">💵 Efectivo</option>
                      <option value="transferencia">🏦 Transferencia</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Fecha
                    </label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={newPago.fecha}
                        onChange={(e) => setNewPago({...newPago, fecha: e.target.value})}
                        className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white [color-scheme:dark]"
                        style={{colorScheme: 'dark'}}
                      />
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setNewPago({...newPago, fecha: new Date().toISOString().split('T')[0]})}
                          className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-xs transition-all"
                        >
                          Hoy
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            setNewPago({...newPago, fecha: yesterday.toISOString().split('T')[0]});
                          }}
                          className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-xs transition-all"
                        >
                          Ayer
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={newPago.hora}
                      onChange={(e) => setNewPago({...newPago, hora: e.target.value})}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white [color-scheme:dark]"
                      style={{colorScheme: 'dark'}}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Monto ($)
                    </label>
                    <input
                      type="number"
                      value={newPago.monto}
                      onChange={(e) => setNewPago({...newPago, monto: e.target.value})}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
                      placeholder="15000"
                    />
                  </div>
                </div>

                {/* Campo de comprobante - solo para transferencias */}
                {newPago.metodoPago === 'transferencia' && (
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Comprobante de Transferencia (Opcional)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newPago.comprobante}
                        onChange={(e) => setNewPago({...newPago, comprobante: e.target.value})}
                        className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
                        placeholder="Ej: Número de operación, referencia, etc."
                      />
                      <p className="text-xs text-gray-400">
                        💡 Puedes agregar el número de operación, CBU, alias o cualquier referencia del comprobante
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddPago}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Registrar Pago
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl border border-green-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-sm font-medium">Efectivo Hoy</p>
                    <p className="text-2xl font-bold text-green-400">${stats.totalEfectivoHoy.toLocaleString()}</p>
                    <p className="text-xs text-green-300 mt-1">Clínica cobra</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl border border-blue-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Transferencias Hoy</p>
                    <p className="text-2xl font-bold text-blue-400">${stats.totalTransferenciaHoy.toLocaleString()}</p>
                    <p className="text-xs text-blue-300 mt-1">Profesional cobra</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium">Pagos Hoy</p>
                    <p className="text-2xl font-bold text-purple-400">{stats.pagosHoy}</p>
                    <p className="text-xs text-purple-300 mt-1">Total registrados</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Pagos Recientes</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pagos.slice(-10).reverse().map(pago => (
                  <div key={pago.id} className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getEstadoColor(pago)}`}></div>
                      <div>
                        <p className="font-semibold">{pago.profesionalNombre}</p>
                        <p className="text-sm text-gray-300">{pago.paciente} - {pago.fecha} {pago.hora}</p>
                        <p className="text-xs text-gray-400">
                          Estado: {pago.estado === 'pendiente' ? 'Pendiente' : 
                                  pago.estado === 'pagado' ? 'Pagado' : 
                                  pago.estado === 'recibida' ? 'Recibida' : 
                                  'Completada'}
                        </p>
                        {pago.comprobante && (
                          <div className="flex items-center space-x-1 mt-1">
                            <FileImage className="w-3 h-3 text-blue-400" />
                            <p className="text-xs text-blue-400 truncate">Comprobante: {pago.comprobante}</p>
                          </div>
                        )}
                        {pago.comprobanteClinica && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Check className="w-3 h-3 text-green-400" />
                            <p className="text-xs text-green-400 truncate">Pago clínica: {pago.comprobanteClinica}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${pago.monto.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{pago.metodoPago}</p>
                      {pago.fechaPago && (
                        <p className="text-xs text-green-400">
                          Pagado: {new Date(pago.fechaPago).toLocaleDateString('es-AR')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Estado de Deudas */}
        {activeTab === 'deudas' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Estado de Deudas por Profesional
              </h2>
              <button
                onClick={() => setFiltros({...filtros, mostrarFiltros: !filtros.mostrarFiltros})}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
              >
                <span>{filtros.mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros</span>
                <span className={`transition-transform ${filtros.mostrarFiltros ? 'rotate-180' : ''}`}>▼</span>
              </button>
            </div>
            
            {/* Filtros expandibles */}
            {filtros.mostrarFiltros && (
              <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-4">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Profesional</label>
                    <select
                      value={filtros.profesional}
                      onChange={(e) => setFiltros({...filtros, profesional: e.target.value})}
                      className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm"
                    >
                      <option value="">Todos los profesionales</option>
                      {profesionales.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Método de Pago</label>
                    <select
                      value={filtros.metodoPago}
                      onChange={(e) => setFiltros({...filtros, metodoPago: e.target.value})}
                      className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm"
                    >
                      <option value="">Todos los métodos</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Fecha Desde</label>
                    <input
                      type="date"
                      value={filtros.fechaDesde}
                      onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
                      className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm [color-scheme:dark]"
                      style={{colorScheme: 'dark'}}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Fecha Hasta</label>
                    <input
                      type="date"
                      value={filtros.fechaHasta}
                      onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
                      className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm [color-scheme:dark]"
                      style={{colorScheme: 'dark'}}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => setFiltros({profesional: '', metodoPago: '', fechaDesde: '', fechaHasta: '', mostrarFiltros: true})}
                  className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
            
            {/* Lista de pagos individuales */}
            <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Pagos Pendientes Individuales</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {aplicarFiltros(pagos)
                  .filter(pago => {
                    // Solo mostrar pagos pendientes o recibidos
                    return (pago.metodoPago === 'efectivo' && pago.estado === 'pendiente') || 
                           (pago.metodoPago === 'transferencia' && pago.estado === 'recibida');
                  })
                  .map(pago => (
                    <div key={pago.id} className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getEstadoColor(pago)}`}></div>
                        <div>
                          <p className="font-semibold">{pago.profesionalNombre}</p>
                          <p className="text-sm text-gray-300">{pago.paciente} - {pago.fecha} {pago.hora}</p>
                          <p className="text-xs text-gray-400">{getEstadoTexto(pago)}</p>
                          {pago.comprobante && (
                            <div className="flex items-center space-x-1 mt-1">
                              <FileImage className="w-3 h-3 text-blue-400" />
                              <p className="text-xs text-blue-400">Comprobante: {pago.comprobante}</p>
                            </div>
                          )}
                          {pago.comprobanteClinica && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Check className="w-3 h-3 text-green-400" />
                              <p className="text-xs text-green-400">Pago clínica: {pago.comprobanteClinica}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-4">
                        <div>
                          <p className="font-semibold">${pago.monto.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{pago.metodoPago}</p>
                          {pago.metodoPago === 'efectivo' ? (
                            <p className="text-xs text-orange-400">Debe: ${pago.gananciaProfesional.toLocaleString()}</p>
                          ) : (
                            <p className="text-xs text-blue-400">Comisión: ${pago.gananciaClinica.toLocaleString()}</p>
                          )}
                        </div>
                        <button
                          onClick={() => marcarPagoIndividual(pago.id, pago.metodoPago)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Marcar Pagado</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="space-y-6">
              {stats.deudaPorProfesional.map(deuda => (
                <div key={deuda.id} className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-300">{deuda.nombre}</h3>
                    <div className="flex space-x-3">
                      {deuda.efectivoPendiente > 0 && (
                        <button
                          onClick={() => marcarEfectivoPagado(deuda.id)}
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Marcar Efectivos Pagados</span>
                        </button>
                      )}
                      {deuda.comisionPendiente > 0 && (
                        <button
                          onClick={() => marcarTransferenciasCobradas(deuda.id)}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Marcar Comisiones Cobradas</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {deuda.efectivoPendiente > 0 && (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-5 h-5 text-orange-400" />
                          <span className="font-semibold text-orange-400">Efectivos Pendientes</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-300">${deuda.efectivoPendiente.toLocaleString()}</p>
                        <p className="text-sm text-orange-300">{deuda.cantidadEfectivos} pagos pendientes</p>
                      </div>
                    )}
                    
                    {deuda.comisionPendiente > 0 && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-blue-400">Comisiones Pendientes</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-300">${deuda.comisionPendiente.toLocaleString()}</p>
                        <p className="text-sm text-blue-300">{deuda.cantidadTransferencias} transferencias</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {stats.deudaPorProfesional.length === 0 && (
                <div className="text-center py-12">
                  <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-400 mb-2">¡Todo al día!</h3>
                  <p className="text-gray-400">No hay deudas pendientes en este momento.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Tab: Reportes */}
        {activeTab === 'reportes' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Reportes e Ingresos
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={exportarReporteCSV}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Exportar CSV</span>
                </button>
                <button
                  onClick={() => setFiltrosReportes({...filtrosReportes, mostrarFiltros: !filtrosReportes.mostrarFiltros})}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
                >
                  <span>{filtrosReportes.mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros</span>
                  <span className={`transition-transform ${filtrosReportes.mostrarFiltros ? 'rotate-180' : ''}`}>▼</span>
                </button>
              </div>
            </div>
            
            {/* Filtros expandibles para reportes */}
            {filtrosReportes.mostrarFiltros && (
              <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-4">Filtros de Reporte</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Profesional</label>
                    <select
                      value={filtrosReportes.profesional}
                      onChange={(e) => setFiltrosReportes({...filtrosReportes, profesional: e.target.value})}
                      className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm"
                    >
                      <option value="">Todos los profesionales</option>
                      {profesionales.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Fecha Desde</label>
                    <input
                      type="date"
                      value={filtrosReportes.fechaDesde}
                      onChange={(e) => setFiltrosReportes({...filtrosReportes, fechaDesde: e.target.value})}
                      className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm [color-scheme:dark]"
                      style={{colorScheme: 'dark'}}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Fecha Hasta</label>
                    <input
                      type="date"
                      value={filtrosReportes.fechaHasta}
                      onChange={(e) => setFiltrosReportes({...filtrosReportes, fechaHasta: e.target.value})}
                      className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm [color-scheme:dark]"
                      style={{colorScheme: 'dark'}}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => setFiltrosReportes({profesional: '', fechaDesde: '', fechaHasta: '', mostrarFiltros: true})}
                  className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
            
            {(() => {
              const reportes = calcularReportes();
              return (
                <>
                  {/* Resumen General */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl border border-green-500/30 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-300 text-sm font-medium">Total Facturado</p>
                          <p className="text-2xl font-bold text-green-400">${reportes.totalGeneral.toLocaleString()}</p>
                          <p className="text-xs text-green-300 mt-1">{reportes.cantidadConsultas} consultas</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl border border-blue-500/30 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-300 text-sm font-medium">Ganancias Profesionales</p>
                          <p className="text-2xl font-bold text-blue-400">${reportes.totalGananciasProfesionales.toLocaleString()}</p>
                          <p className="text-xs text-blue-300 mt-1">Total a pagar</p>
                        </div>
                        <User className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-300 text-sm font-medium">Ganancias Clínica</p>
                          <p className="text-2xl font-bold text-purple-400">${reportes.totalGananciasClinica.toLocaleString()}</p>
                          <p className="text-xs text-purple-300 mt-1">Comisiones</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-2xl border border-orange-500/30 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-300 text-sm font-medium">Promedio x Consulta</p>
                          <p className="text-2xl font-bold text-orange-400">
                            ${reportes.cantidadConsultas > 0 ? Math.round(reportes.totalGeneral / reportes.cantidadConsultas).toLocaleString() : '0'}
                          </p>
                          <p className="text-xs text-orange-300 mt-1">Por turno</p>
                        </div>
                        <Calendar className="w-8 h-8 text-orange-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Desglose por Método de Pago */}
                  <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
                    <h3 className="text-lg font-semibold text-purple-300 mb-4">Desglose por Método de Pago</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-400" />
                          <span className="font-semibold text-green-400">Efectivo</span>
                        </div>
                        <p className="text-2xl font-bold text-green-300">${reportes.totalEfectivo.toLocaleString()}</p>
                        <p className="text-sm text-green-300">
                          {Math.round((reportes.totalEfectivo / reportes.totalGeneral) * 100) || 0}% del total
                        </p>
                      </div>
                      
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CreditCard className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-blue-400">Transferencias</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-300">${reportes.totalTransferencias.toLocaleString()}</p>
                        <p className="text-sm text-blue-300">
                          {Math.round((reportes.totalTransferencias / reportes.totalGeneral) * 100) || 0}% del total
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reporte por Profesional */}
                  <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-purple-300">Reporte por Profesional</h3>
                      {profesionalDetallado && (
                        <button
                          onClick={() => setProfesionalDetallado(null)}
                          className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1"
                        >
                          <span>← Volver al Resumen</span>
                        </button>
                      )}
                    </div>
                    
                    {!profesionalDetallado ? (
                      <div className="space-y-4">
                        {reportes.reportePorProfesional.map(reporte => (
                          <div 
                            key={reporte.id} 
                            className="bg-black/30 rounded-xl p-4 cursor-pointer hover:bg-black/40 transition-all transform hover:scale-[1.01] border border-transparent hover:border-purple-500/30"
                            onClick={() => setProfesionalDetallado(reporte.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-lg">{reporte.nombre}</h4>
                                <p className="text-sm text-gray-300">{reporte.especialidad}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-400">${reporte.totalFacturado.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">{reporte.cantidadConsultas} consultas</p>
                                <p className="text-xs text-purple-400">👆 Click para detalles</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-300">Ganancia Profesional</p>
                                <p className="font-semibold text-blue-400">${reporte.gananciaProfesional.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-300">Comisión Clínica</p>
                                <p className="font-semibold text-purple-400">${reporte.gananciaClinica.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-300">Efectivos</p>
                                <p className="font-semibold text-green-400">
                                  {reporte.efectivos.cantidad} - ${reporte.efectivos.monto.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-300">Transferencias</p>
                                <p className="font-semibold text-cyan-400">
                                  {reporte.transferencias.cantidad} - ${reporte.transferencias.monto.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {reportes.reportePorProfesional.length === 0 && (
                          <div className="text-center py-8">
                            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-400">No hay datos para mostrar con los filtros aplicados</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      (() => {
                        const detalles = calcularDetallesProfesional(profesionalDetallado);
                        if (!detalles) return <p className="text-red-400">Error al cargar detalles</p>;
                        
                        return (
                          <div className="space-y-6">
                            {/* Header del profesional */}
                            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-2xl font-bold">{detalles.profesional.nombre}</h3>
                                  <p className="text-purple-300">{detalles.profesional.especialidad}</p>
                                  <p className="text-sm text-gray-400">
                                    {detalles.profesional.porcentaje}% profesional • ${detalles.profesional.valorTurno.toLocaleString()} por turno
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-3xl font-bold text-green-400">
                                    ${detalles.estadisticas.totalFacturado.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-gray-300">Total facturado</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Estadísticas principales */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                <p className="text-blue-300 text-sm">Total Consultas</p>
                                <p className="text-2xl font-bold text-blue-400">{detalles.estadisticas.totalConsultas}</p>
                                <p className="text-xs text-blue-300">
                                  {detalles.estadisticas.consultasPorDia.toFixed(1)} por día promedio
                                </p>
                              </div>
                              
                              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                <p className="text-green-300 text-sm">Ganancia Total</p>
                                <p className="text-2xl font-bold text-green-400">
                                  ${detalles.estadisticas.totalGanado.toLocaleString()}
                                </p>
                                <p className="text-xs text-green-300">
                                  ${Math.round(detalles.estadisticas.promedioPorConsulta * detalles.profesional.porcentaje / 100).toLocaleString()} promedio
                                </p>
                              </div>
                              
                              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                                <p className="text-purple-300 text-sm">Días Activos</p>
                                <p className="text-2xl font-bold text-purple-400">{detalles.estadisticas.diasActivos}</p>
                                <p className="text-xs text-purple-300">
                                  de {detalles.estadisticas.diasTranscurridos} días totales
                                </p>
                              </div>
                              
                              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                                <p className="text-orange-300 text-sm">Método Preferido</p>
                                <p className="text-lg font-bold text-orange-400">
                                  {detalles.estadisticas.metodosPreferidos.efectivo.porcentaje > 
                                   detalles.estadisticas.metodosPreferidos.transferencia.porcentaje ? 
                                   '💵 Efectivo' : '🏦 Transferencia'}
                                </p>
                                <p className="text-xs text-orange-300">
                                  {Math.round(Math.max(
                                    detalles.estadisticas.metodosPreferidos.efectivo.porcentaje,
                                    detalles.estadisticas.metodosPreferidos.transferencia.porcentaje
                                  ))}% de las veces
                                </p>
                              </div>
                            </div>
                            
                            {/* Estado de deudas */}
                            {(detalles.pendientes.efectivos > 0 || detalles.pendientes.transferencias > 0) && (
                              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                <h4 className="font-semibold text-red-300 mb-3">⚠️ Deudas Pendientes</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {detalles.pendientes.efectivos > 0 && (
                                    <div>
                                      <p className="text-orange-300 text-sm">Efectivos Pendientes</p>
                                      <p className="text-xl font-bold text-orange-400">
                                        ${detalles.pendientes.efectivos.toLocaleString()}
                                      </p>
                                      <p className="text-xs text-orange-300">
                                        {detalles.pendientes.cantidadEfectivos} pagos pendientes
                                      </p>
                                    </div>
                                  )}
                                  {detalles.pendientes.transferencias > 0 && (
                                    <div>
                                      <p className="text-blue-300 text-sm">Comisiones Pendientes</p>
                                      <p className="text-xl font-bold text-blue-400">
                                        ${detalles.pendientes.transferencias.toLocaleString()}
                                      </p>
                                      <p className="text-xs text-blue-300">
                                        {detalles.pendientes.cantidadTransferencias} transferencias
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Historial de pagos */}
                            <div className="bg-black/30 rounded-xl p-4">
                              <h4 className="font-semibold text-purple-300 mb-4">📋 Historial Completo de Pagos</h4>
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {detalles.pagosProfesional.map(pago => (
                                  <div key={pago.id} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <div className={`w-3 h-3 rounded-full ${getEstadoColor(pago)}`}></div>
                                      <div>
                                        <p className="font-medium">{pago.paciente}</p>
                                        <p className="text-xs text-gray-400">{pago.fecha} {pago.hora}</p>
                                        {pago.comprobante && (
                                          <p className="text-xs text-blue-400">📄 {pago.comprobante}</p>
                                        )}
                                        {pago.comprobanteClinica && (
                                          <p className="text-xs text-green-400">✅ {pago.comprobanteClinica}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">${pago.monto.toLocaleString()}</p>
                                      <p className="text-xs text-gray-400">{pago.metodoPago}</p>
                                      <p className="text-xs">
                                        <span className="text-blue-400">+${pago.gananciaProfesional.toLocaleString()}</span>
                                        {' / '}
                                        <span className="text-purple-400">${pago.gananciaClinica.toLocaleString()}</span>
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
        
        {/* Tab: Logs */}
        {activeTab === 'logs' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Registro de Actividad (Logs)
            </h2>
            
            <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {logs.map(log => (
                  <div key={log.id} className="p-4 bg-black/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          log.tipo === 'profesional_agregado' ? 'bg-green-400' :
                          log.tipo === 'pago_registrado' ? 'bg-blue-400' :
                          log.tipo === 'pago_marcado' ? 'bg-yellow-400' :
                          'bg-purple-400'
                        }`}></div>
                        <span className="font-semibold text-sm">{log.descripcion}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(log.timestamp).toLocaleString('es-AR')}
                      </span>
                    </div>
                    {Object.keys(log.detalles).length > 0 && (
                      <div className="text-xs text-gray-300 ml-4">
                        {Object.entries(log.detalles).map(([key, value]) => (
                          <span key={key} className="mr-4">
                            <strong>{key}:</strong> {typeof value === 'number' ? value.toLocaleString() : value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {logs.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">Sin actividad registrada</h3>
                    <p className="text-gray-500">Los logs aparecerán aquí conforme uses la aplicación.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Comprobantes */}
      {showComprobanteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-purple-500/30 p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-purple-300">Agregar Comprobantes</h3>
              <button
                onClick={() => setShowComprobanteModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Comprobante del Profesional (Opcional)
                </label>
                <input
                  type="text"
                  value={comprobantes.profesional}
                  onChange={(e) => setComprobantes({...comprobantes, profesional: e.target.value})}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
                  placeholder="Ej: Número de operación, referencia, etc."
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Comprobante de la transferencia que envió el profesional
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Comprobante de Pago de la Clínica (Opcional)
                </label>
                <input
                  type="text"
                  value={comprobantes.clinica}
                  onChange={(e) => setComprobantes({...comprobantes, clinica: e.target.value})}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
                  placeholder="Ej: Número de transferencia de pago, etc."
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Comprobante del pago que realizó la clínica al profesional
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <button
                onClick={confirmarComprobantes}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowComprobanteModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultorioPagosApp;
                    

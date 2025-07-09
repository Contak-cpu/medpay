import { useMemo, useCallback } from 'react';

export const useOptimizedCalculations = (pagos, profesionales, filtros) => {
  // Memoizar estadísticas generales
  const estadisticas = useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0];
    const pagosHoy = pagos.filter(p => p.fecha === hoy);
    
    const efectivoPendiente = pagos.filter(p => 
      p.metodoPago === 'efectivo' && p.estado === 'pendiente'
    );
    const transferenciasPendientes = pagos.filter(p => 
      p.metodoPago === 'transferencia' && p.estado === 'recibida'
    );
    
    return {
      totalEfectivoHoy: pagosHoy.filter(p => p.metodoPago === 'efectivo')
        .reduce((sum, p) => sum + p.monto, 0),
      totalTransferenciaHoy: pagosHoy.filter(p => p.metodoPago === 'transferencia')
        .reduce((sum, p) => sum + p.monto, 0),
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
  }, [pagos, profesionales]);

  // Memoizar pagos filtrados
  const pagosFiltrados = useMemo(() => {
    return pagos.filter(pago => {
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
  }, [pagos, filtros]);

  // Memoizar reportes
  const reportes = useMemo(() => {
    const totalEfectivo = pagosFiltrados.filter(p => p.metodoPago === 'efectivo')
      .reduce((sum, p) => sum + p.monto, 0);
    const totalTransferencias = pagosFiltrados.filter(p => p.metodoPago === 'transferencia')
      .reduce((sum, p) => sum + p.monto, 0);
    const totalGeneral = totalEfectivo + totalTransferencias;
    
    const totalGananciasProfesionales = pagosFiltrados.reduce((sum, p) => sum + p.gananciaProfesional, 0);
    const totalGananciasClinica = pagosFiltrados.reduce((sum, p) => sum + p.gananciaClinica, 0);
    
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
  }, [pagosFiltrados, profesionales]);

  // Memoizar detalles de profesional
  const calcularDetallesProfesional = useCallback((profesionalId) => {
    const profesional = profesionales.find(p => p.id === profesionalId);
    if (!profesional) return null;

    const pagosProfesional = pagosFiltrados.filter(p => p.profesionalId === profesionalId);
    
    const pagosCompletados = pagosProfesional.filter(p => p.estado === 'pagado' || p.estado === 'completada');
    const pagosPendientes = pagosProfesional.filter(p => p.estado === 'pendiente' || p.estado === 'recibida');
    
    const efectivos = pagosProfesional.filter(p => p.metodoPago === 'efectivo');
    const transferencias = pagosProfesional.filter(p => p.metodoPago === 'transferencia');
    
    const fechas = [...new Set(pagosProfesional.map(p => p.fecha))].sort();
    const primerPago = fechas[0];
    const ultimoPago = fechas[fechas.length - 1];
    
    const diasActivos = fechas.length;
    const diasTranscurridos = primerPago && ultimoPago ? 
      Math.ceil((new Date(ultimoPago) - new Date(primerPago)) / (1000 * 60 * 60 * 24)) + 1 : 1;
    
    const totalFacturado = pagosProfesional.reduce((sum, p) => sum + p.monto, 0);
    const totalGanado = pagosProfesional.reduce((sum, p) => sum + p.gananciaProfesional, 0);
    const totalComisiones = pagosProfesional.reduce((sum, p) => sum + p.gananciaClinica, 0);
    
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
  }, [pagosFiltrados, profesionales]);

  return {
    estadisticas,
    pagosFiltrados,
    reportes,
    calcularDetallesProfesional
  };
}; 
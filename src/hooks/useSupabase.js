import { useState, useEffect } from 'react'
import { db } from '../lib/supabase'

export function useSupabase() {
  const [profesionales, setProfesionales] = useState([])
  const [pagos, setPagos] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar datos iniciales
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [profesionalesData, pagosData, logsData] = await Promise.all([
        db.getProfesionales(),
        db.getPagos(),
        db.getLogs()
      ])
      
      setProfesionales(profesionalesData)
      setPagos(pagosData)
      setLogs(logsData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // PROFESIONALES
  const addProfesional = async (profesionalData) => {
    try {
      const newProfesional = await db.createProfesional(profesionalData)
      setProfesionales(prev => [...prev, newProfesional])
      
      // Agregar log
      await addLog('profesional_agregado', `Profesional agregado: ${newProfesional.nombre}`, {
        especialidad: newProfesional.especialidad,
        porcentaje: newProfesional.porcentaje,
        valorTurno: newProfesional.valor_turno
      })
      
      return newProfesional
    } catch (err) {
      console.error('Error adding profesional:', err)
      throw err
    }
  }

  // PAGOS
  const addPago = async (pagoData) => {
    try {
      const newPago = await db.createPago(pagoData)
      
      // Recargar pagos para obtener datos completos con JOIN
      const updatedPagos = await db.getPagos()
      setPagos(updatedPagos)
      
      // Agregar log
      await addLog('pago_registrado', `Pago registrado: ${pagoData.profesionalNombre} - ${pagoData.paciente}`, {
        metodoPago: pagoData.metodoPago,
        monto: pagoData.monto,
        fecha: pagoData.fecha,
        hora: pagoData.hora,
        tieneComprobante: !!pagoData.comprobante
      })
      
      return newPago
    } catch (err) {
      console.error('Error adding pago:', err)
      throw err
    }
  }

  const updatePago = async (pagoId, updates) => {
    try {
      await db.updatePago(pagoId, updates)
      
      // Recargar pagos
      const updatedPagos = await db.getPagos()
      setPagos(updatedPagos)
      
      return true
    } catch (err) {
      console.error('Error updating pago:', err)
      throw err
    }
  }

  const markPagoAsCompleted = async (pagoId, estado, comprobanteProfesional, comprobanteClinica) => {
    try {
      const updates = {
        estado,
        fechaPago: new Date().toISOString()
      }
      
      if (comprobanteProfesional) updates.comprobante = comprobanteProfesional
      if (comprobanteClinica) updates.comprobanteClinica = comprobanteClinica
      
      await updatePago(pagoId, updates)
      
      // Encontrar el pago para el log
      const pago = pagos.find(p => p.id === pagoId)
      if (pago) {
        await addLog('pago_marcado', `Pago marcado como ${estado}: ${pago.profesionalNombre} - ${pago.paciente}`, {
          metodoPago: pago.metodoPago,
          monto: pago.monto,
          estadoAnterior: pago.estado,
          estadoNuevo: estado,
          tieneComprobanteProfesional: !!comprobanteProfesional,
          tieneComprobanteClinica: !!comprobanteClinica
        })
      }
      
      return true
    } catch (err) {
      console.error('Error marking pago as completed:', err)
      throw err
    }
  }

  // LOGS
  const addLog = async (tipo, descripcion, detalles = {}) => {
    try {
      const logData = {
        tipo,
        descripcion,
        detalles,
        usuario: 'Admin'
      }
      
      const newLog = await db.createLog(logData)
      
      // Agregar al estado local (al inicio del array)
      setLogs(prev => [
        {
          id: newLog.id,
          timestamp: newLog.created_at,
          tipo: newLog.tipo,
          descripcion: newLog.descripcion,
          detalles: newLog.detalles || {},
          usuario: newLog.usuario
        },
        ...prev.slice(0, 999) // Mantener solo últimos 1000
      ])
      
      return newLog
    } catch (err) {
      console.error('Error adding log:', err)
      throw err
    }
  }

  // UTILIDADES
  const clearAllData = async () => {
    try {
      await db.clearAllData()
      setProfesionales([])
      setPagos([])
      setLogs([])
      
      await addLog('datos_limpiados', 'Todos los datos fueron limpiados', {
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('Error clearing data:', err)
      throw err
    }
  }

  const refreshData = async () => {
    await loadAllData()
  }

  return {
    // Estado
    profesionales,
    pagos,
    logs,
    loading,
    error,
    
    // Acciones
    addProfesional,
    addPago,
    updatePago,
    markPagoAsCompleted,
    addLog,
    clearAllData,
    refreshData,
    
    // Utilidades
    setProfesionales,
    setPagos,
    setLogs
  }
}

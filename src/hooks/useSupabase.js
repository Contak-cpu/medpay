import { useState, useEffect } from 'react'
import { db } from '../file/supabase'

export function useSupabase() {
  const [profesionales, setProfesionales] = useState([])
  const [pagos, setPagos] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🔄 useSupabase: Iniciando carga de datos...')
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      console.log('🔄 useSupabase: loadAllData iniciado')
      setLoading(true)
      setError(null)
      
      console.log('🔄 useSupabase: Cargando datos de Supabase...')
      
      const [profesionalesData, pagosData, logsData] = await Promise.all([
        db.getProfesionales(),
        db.getPagos(),
        db.getLogs()
      ])
      
      console.log('✅ useSupabase: Datos cargados exitosamente:', {
        profesionales: profesionalesData.length,
        pagos: pagosData.length,
        logs: logsData.length
      })
      
      setProfesionales(profesionalesData)
      setPagos(pagosData)
      setLogs(logsData)
    } catch (err) {
      console.error('❌ useSupabase: Error loading data:', err)
      setError(err.message || 'Error al cargar datos')
    } finally {
      console.log('🔄 useSupabase: Finalizando carga de datos')
      setLoading(false)
    }
  }

  // PROFESIONALES
  const addProfesional = async (profesionalData) => {
    try {
      console.log('🔄 useSupabase: Agregando profesional:', profesionalData)
      const newProfesional = await db.createProfesional(profesionalData)
      
      // Verificar que el profesional se creó correctamente
      if (!newProfesional || !newProfesional.id) {
        throw new Error('No se pudo crear el profesional. Respuesta inválida del servidor.')
      }
      
      console.log('✅ useSupabase: Profesional agregado exitosamente:', newProfesional)
      setProfesionales(prev => [...prev, newProfesional])
      
      // Agregar log
      await addLog('profesional_agregado', `Profesional agregado: ${newProfesional.nombre}`, {
        especialidad: newProfesional.especialidad,
        porcentaje: newProfesional.porcentaje,
        valorTurno: newProfesional.valor_turno
      })
      
      return newProfesional
    } catch (err) {
      console.error('❌ useSupabase: Error adding profesional:', err)
      // Asegurar que el error se propague correctamente
      throw new Error(err.message || 'Error al agregar profesional')
    }
  }

  const updateProfesional = async (id, updates) => {
    try {
      console.log('🔄 useSupabase: Actualizando profesional:', id, updates)
      const updatedProfesional = await db.updateProfesional(id, updates)
      setProfesionales(prev => 
        prev.map(p => p.id === id ? updatedProfesional : p)
      )
      
      await addLog('profesional_actualizado', `Profesional actualizado: ${updatedProfesional.nombre}`, {
        id,
        cambios: updates
      })
      
      return updatedProfesional
    } catch (err) {
      console.error('❌ useSupabase: Error updating profesional:', err)
      throw err
    }
  }

  const deleteProfesional = async (id) => {
    try {
      console.log('🔄 useSupabase: Eliminando profesional:', id)
      const profesional = profesionales.find(p => p.id === id)
      await db.deleteProfesional(id)
      setProfesionales(prev => prev.filter(p => p.id !== id))
      
      await addLog('profesional_eliminado', `Profesional eliminado: ${profesional?.nombre}`, {
        id,
        nombre: profesional?.nombre
      })
    } catch (err) {
      console.error('❌ useSupabase: Error deleting profesional:', err)
      throw err
    }
  }

  // PAGOS
  const addPago = async (pagoData) => {
    try {
      console.log('🔄 useSupabase: Agregando pago:', pagoData)
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
      console.error('❌ useSupabase: Error adding pago:', err)
      throw err
    }
  }

  const updatePago = async (pagoId, updates) => {
    try {
      console.log('🔄 useSupabase: Actualizando pago:', pagoId, updates)
      await db.updatePago(pagoId, updates)
      
      // Recargar pagos
      const updatedPagos = await db.getPagos()
      setPagos(updatedPagos)
      
      return true
    } catch (err) {
      console.error('❌ useSupabase: Error updating pago:', err)
      throw err
    }
  }

  const markPagoAsCompleted = async (pagoId, estado, comprobanteProfesional, comprobanteClinica) => {
    try {
      console.log('🔄 useSupabase: Marcando pago como completado:', pagoId, estado)
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
      console.error('❌ useSupabase: Error marking pago as completed:', err)
      throw err
    }
  }

  const deletePago = async (pagoId) => {
    try {
      console.log('🔄 useSupabase: Eliminando pago:', pagoId)
      const pago = pagos.find(p => p.id === pagoId)
      await db.deletePago(pagoId)
      
      // Recargar pagos
      const updatedPagos = await db.getPagos()
      setPagos(updatedPagos)
      
      await addLog('pago_eliminado', `Pago eliminado: ${pago?.profesionalNombre} - ${pago?.paciente}`, {
        id: pagoId,
        monto: pago?.monto,
        fecha: pago?.fecha
      })
    } catch (err) {
      console.error('❌ useSupabase: Error deleting pago:', err)
      throw err
    }
  }

  // LOGS
  const addLog = async (tipo, descripcion, detalles = {}) => {
    try {
      console.log('🔄 useSupabase: Agregando log:', tipo, descripcion)
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
      console.error('❌ useSupabase: Error adding log:', err)
      throw err
    }
  }

  // UTILIDADES
  const clearAllData = async () => {
    try {
      console.log('🔄 useSupabase: Limpiando todos los datos...')
      await db.clearAllData()
      setProfesionales([])
      setPagos([])
      setLogs([])
      
      await addLog('datos_limpiados', 'Todos los datos fueron limpiados', {
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('❌ useSupabase: Error clearing data:', err)
      throw err
    }
  }

  const refreshData = async () => {
    console.log('🔄 useSupabase: Refrescando datos...')
    await loadAllData()
  }

  return {
    // Estado
    profesionales,
    pagos,
    logs,
    loading,
    error,
    
    // Acciones de Profesionales
    addProfesional,
    updateProfesional,
    deleteProfesional,
    
    // Acciones de Pagos
    addPago,
    updatePago,
    markPagoAsCompleted,
    deletePago,
    
    // Acciones de Logs
    addLog,
    
    // Utilidades
    clearAllData,
    refreshData,
    loadAllData
  }
}

import { useState, useEffect, useCallback } from 'react'
import { db } from '../file/supabase'
import { shouldUseTestData } from '../config/environment'
import { useTestData } from './useTestData'

export function useSupabase(config = {}) {
  const { setProfesionales: setProfesionalesZustand, setPagos: setPagosZustand } = config;
  
  const [profesionales, setProfesionales] = useState([])
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(false) // Cambiado a false para carga más rápida
  const [error, setError] = useState(null)
  const [initialized, setInitialized] = useState(false)
  
  // Hook de datos de testeo
  const testDataHook = useTestData()
  const isTestMode = shouldUseTestData() && testDataHook.isTestMode

  // Función para sincronizar con Zustand
  const syncWithZustand = useCallback((newProfesionales, newPagos) => {
    if (setProfesionalesZustand) {
      setProfesionalesZustand(newProfesionales);
    }
    if (setPagosZustand) {
      setPagosZustand(newPagos);
    }
  }, [setProfesionalesZustand, setPagosZustand]);

  // Cargar datos iniciales de forma asíncrona
  useEffect(() => {
    if (!initialized) {
      console.log('🔄 useSupabase: Iniciando carga de datos...')
      // Delay para no bloquear la carga inicial
      const timer = setTimeout(() => {
        loadAllData()
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [initialized, isTestMode, testDataHook.isTestMode])

  const loadAllData = async () => {
    try {
      console.log('🔄 useSupabase: loadAllData iniciado')
      setLoading(true)
      setError(null)
      
      if (isTestMode) {
        console.log('🧪 useSupabase: Usando datos de testeo')
        const testProfesionales = [...testDataHook.profesionales];
        const testPagos = [...testDataHook.pagos];
        setProfesionales(testProfesionales)
        setPagos(testPagos)
        syncWithZustand(testProfesionales, testPagos);
        setInitialized(true)
        setLoading(false)
        return
      }
      
      console.log('🔄 useSupabase: Cargando datos de Supabase...')
      
      // Cargar datos en paralelo para mayor velocidad
      const [profesionalesData, pagosData] = await Promise.all([
        db.getProfesionales().catch(err => {
          console.warn('⚠️ Error cargando profesionales:', err);
          return [];
        }),
        db.getPagos().catch(err => {
          console.warn('⚠️ Error cargando pagos:', err);
          return [];
        })
      ])
      
      console.log('✅ useSupabase: Datos cargados exitosamente:', {
        profesionales: profesionalesData.length,
        pagos: pagosData.length
      })
      
      setProfesionales(profesionalesData)
      setPagos(pagosData)
      syncWithZustand(profesionalesData, pagosData);
      setInitialized(true)
    } catch (err) {
      console.error('❌ useSupabase: Error loading data:', err)
      setError(err.message || 'Error al cargar datos')
      // Aún así, marcar como inicializado para que la app funcione
      setInitialized(true)
    } finally {
      console.log('🔄 useSupabase: Finalizando carga de datos')
      setLoading(false)
    }
  }

  // PROFESIONALES
  const addProfesional = async (profesionalData) => {
    try {
      console.log('🔄 useSupabase: Agregando profesional:', profesionalData)
      
      if (isTestMode) {
        console.log('🧪 useSupabase: Agregando profesional en modo testeo')
        testDataHook.addTestProfesional(profesionalData)
        // Sincronizar después de un breve delay para asegurar que el estado se actualice
        setTimeout(() => {
          const newProfesionales = [...testDataHook.profesionales];
          setProfesionales(newProfesionales)
          syncWithZustand(newProfesionales, pagos);
        }, 0)
        return { id: testDataHook.profesionales.length + 1, ...profesionalData }
      }
      
      const newProfesional = await db.createProfesional(profesionalData)
      
      // Verificar que el profesional se creó correctamente
      if (!newProfesional || !newProfesional.id) {
        throw new Error('No se pudo crear el profesional. Respuesta inválida del servidor.')
      }
      
      console.log('✅ useSupabase: Profesional agregado exitosamente:', newProfesional)
      const updatedProfesionales = [...profesionales, newProfesional];
      setProfesionales(updatedProfesionales)
      syncWithZustand(updatedProfesionales, pagos);
      
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
      
      if (isTestMode) {
        console.log('🧪 useSupabase: Actualizando profesional en modo testeo')
        testDataHook.updateTestProfesional(id, updates)
        setTimeout(() => {
          const updatedProfesionales = [...testDataHook.profesionales];
          setProfesionales(updatedProfesionales)
          syncWithZustand(updatedProfesionales, pagos);
        }, 0)
        return { id, ...updates }
      }
      
      const updatedProfesional = await db.updateProfesional(id, updates)
      const updatedProfesionales = profesionales.map(p => p.id === id ? updatedProfesional : p);
      setProfesionales(updatedProfesionales)
      syncWithZustand(updatedProfesionales, pagos);
      
      return updatedProfesional
    } catch (err) {
      console.error('❌ useSupabase: Error updating profesional:', err)
      throw err
    }
  }

  const deleteProfesional = async (id) => {
    try {
      console.log('🔄 useSupabase: Eliminando profesional:', id)
      
      if (isTestMode) {
        console.log('🧪 useSupabase: Eliminando profesional en modo testeo')
        testDataHook.deleteTestProfesional(id)
        setTimeout(() => {
          const updatedProfesionales = [...testDataHook.profesionales];
          const updatedPagos = [...testDataHook.pagos];
          setProfesionales(updatedProfesionales)
          setPagos(updatedPagos)
          syncWithZustand(updatedProfesionales, updatedPagos);
        }, 0)
        return
      }
      
      const profesional = profesionales.find(p => p.id === id)
      await db.deleteProfesional(id)
      const updatedProfesionales = profesionales.filter(p => p.id !== id);
      setProfesionales(updatedProfesionales)
      syncWithZustand(updatedProfesionales, pagos);
      
    } catch (err) {
      console.error('❌ useSupabase: Error deleting profesional:', err)
      throw err
    }
  }

  // PAGOS
  const addPago = async (pagoData) => {
    try {
      console.log('🔄 useSupabase: Agregando pago:', pagoData)
      
      if (isTestMode) {
        console.log('🧪 useSupabase: Agregando pago en modo testeo')
        testDataHook.addTestPago(pagoData)
        // Sincronizar después de un breve delay para asegurar que el estado se actualice
        setTimeout(() => {
          const newPagos = [...testDataHook.pagos];
          setPagos(newPagos)
          syncWithZustand(profesionales, newPagos);
        }, 0)
        return { id: testDataHook.pagos.length + 1, ...pagoData }
      }
      
      const newPago = await db.createPago(pagoData)
      
      // Recargar pagos para obtener datos completos con JOIN
      const updatedPagos = await db.getPagos()
      setPagos(updatedPagos)
      syncWithZustand(profesionales, updatedPagos);
      
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
      syncWithZustand(profesionales, updatedPagos);
      
      return true
    } catch (err) {
      console.error('❌ useSupabase: Error updating pago:', err)
      throw err
    }
  }

  const markPagoAsCompleted = async (pagoId, estado, comprobanteProfesional, comprobanteClinica) => {
    try {
      console.log('🔄 useSupabase: Marcando pago como completado:', pagoId, estado)
      
      if (isTestMode) {
        console.log('🧪 useSupabase: Marcando pago como completado en modo testeo')
        testDataHook.updateTestPagoStatus(pagoId, estado, comprobanteProfesional, comprobanteClinica)
        setTimeout(() => {
          const updatedPagos = [...testDataHook.pagos];
          setPagos(updatedPagos)
          syncWithZustand(profesionales, updatedPagos);
        }, 0)
        return true
      }
      
      const updates = {
        estado,
        fecha_pago: new Date().toISOString(),
        comprobante: comprobanteProfesional || null,
        comprobante_clinica: comprobanteClinica || null
      }
      
      await db.updatePago(pagoId, updates)
      
      // Recargar pagos
      const updatedPagos = await db.getPagos()
      setPagos(updatedPagos)
      syncWithZustand(profesionales, updatedPagos);
      
      return true
    } catch (err) {
      console.error('❌ useSupabase: Error marking pago as completed:', err)
      throw err
    }
  }

  const deletePago = async (pagoId) => {
    try {
      console.log('🔄 useSupabase: Eliminando pago:', pagoId)
      
      if (isTestMode) {
        console.log('🧪 useSupabase: Eliminando pago en modo testeo')
        testDataHook.deleteTestPago(pagoId)
        setTimeout(() => {
          const updatedPagos = [...testDataHook.pagos];
          setPagos(updatedPagos)
          syncWithZustand(profesionales, updatedPagos);
        }, 0)
        return
      }
      
      await db.deletePago(pagoId)
      
      // Recargar pagos
      const updatedPagos = await db.getPagos()
      setPagos(updatedPagos)
      syncWithZustand(profesionales, updatedPagos);
      
    } catch (err) {
      console.error('❌ useSupabase: Error deleting pago:', err)
      throw err
    }
  }

  const refreshData = async () => {
    console.log('🔄 useSupabase: Refrescando datos...')
    await loadAllData()
  }

  const clearAllData = async () => {
    try {
      console.log('🔄 useSupabase: Limpiando todos los datos...')
      
      if (isTestMode) {
        console.log('🧪 useSupabase: Limpiando datos de testeo')
        testDataHook.clearTestData()
        setProfesionales([])
        setPagos([])
        syncWithZustand([], []);
        return
      }
      
      // En Supabase, podríamos implementar una función para limpiar datos
      // Por ahora, solo limpiamos el estado local
      setProfesionales([])
      setPagos([])
      syncWithZustand([], []);
      
    } catch (err) {
      console.error('❌ useSupabase: Error clearing data:', err)
      throw err
    }
  }

  const addLog = async (tipo, descripcion, datos = {}) => {
    try {
      console.log('🔄 useSupabase: Agregando log:', tipo, descripcion)
      
      if (isTestMode) {
        console.log('🧪 useSupabase: Agregando log en modo testeo')
        testDataHook.addTestLog(tipo, descripcion, datos)
        return
      }
      
      // En Supabase, podríamos implementar logging
      console.log('📝 Log:', { tipo, descripcion, datos, timestamp: new Date().toISOString() })
      
    } catch (err) {
      console.error('❌ useSupabase: Error adding log:', err)
      // No lanzar error para logs
    }
  }

  return {
    profesionales,
    pagos,
    loading,
    error,
    addProfesional,
    updateProfesional,
    deleteProfesional,
    addPago,
    updatePago,
    markPagoAsCompleted,
    deletePago,
    refreshData,
    clearAllData,
    addLog,
    isTestMode,
    testDataHook
  }
}

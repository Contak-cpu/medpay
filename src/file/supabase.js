import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('=== SUPABASE CONFIGURATION ===')
console.log('Supabase URL:', supabaseUrl ? 'Presente' : 'FALTANTE')
console.log('Supabase Key:', supabaseAnonKey ? 'Presente' : 'FALTANTE')
console.log('Environment variables:', {
  VITE_SUPABASE_URL: supabaseUrl,
  VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '***' : 'FALTANTE'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Variables de entorno faltantes:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Presente' : 'FALTANTE')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

console.log('✅ Variables de entorno configuradas correctamente')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Cliente Supabase creado exitosamente')

// Funciones de la base de datos
export const db = {
  // PROFESIONALES
  async getProfesionales() {
    console.log('🔄 Obteniendo profesionales...')
    try {
      const { data, error } = await supabase
        .from('profesionales')
        .select('*')
        .order('nombre')
      
      if (error) {
        console.error('❌ Error obteniendo profesionales:', error)
        throw error
      }
      
      console.log('✅ Profesionales obtenidos:', data?.length || 0)
      return data || []
    } catch (err) {
      console.error('❌ Error en getProfesionales:', err)
      throw err
    }
  },

  async createProfesional(profesional) {
    console.log('🔄 Creando profesional:', profesional)
    try {
      const { data, error } = await supabase
        .from('profesionales')
        .insert([profesional])
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creando profesional:', error)
        throw error
      }
      
      console.log('✅ Profesional creado:', data)
      return data
    } catch (err) {
      console.error('❌ Error en createProfesional:', err)
      throw err
    }
  },

  async updateProfesional(id, updates) {
    console.log('🔄 Actualizando profesional:', id, updates)
    try {
      const { data, error } = await supabase
        .from('profesionales')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error actualizando profesional:', error)
        throw error
      }
      
      console.log('✅ Profesional actualizado:', data)
      return data
    } catch (err) {
      console.error('❌ Error en updateProfesional:', err)
      throw err
    }
  },

  async deleteProfesional(id) {
    console.log('🔄 Eliminando profesional:', id)
    try {
      const { error } = await supabase
        .from('profesionales')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('❌ Error eliminando profesional:', error)
        throw error
      }
      
      console.log('✅ Profesional eliminado:', id)
    } catch (err) {
      console.error('❌ Error en deleteProfesional:', err)
      throw err
    }
  },

  // PAGOS
  async getPagos() {
    console.log('🔄 Obteniendo pagos...')
    try {
      const { data, error } = await supabase
        .from('pagos')
        .select(`
          *,
          profesionales (
            nombre,
            especialidad
          )
        `)
        .order('fecha', { ascending: false })
      
      if (error) {
        console.error('❌ Error obteniendo pagos:', error)
        throw error
      }
      
      // Transformar datos para compatibilidad con el frontend
      const transformedData = data?.map(pago => ({
        id: pago.id,
        profesionalId: pago.profesional_id,
        profesionalNombre: pago.profesionales?.nombre || 'Sin nombre',
        paciente: pago.paciente,
        metodoPago: pago.metodo_pago,
        fecha: pago.fecha,
        hora: pago.hora,
        monto: parseFloat(pago.monto),
        porcentajeProfesional: pago.porcentaje_profesional,
        gananciaProfesional: parseFloat(pago.ganancia_profesional),
        gananciaClinica: parseFloat(pago.ganancia_clinica),
        estado: pago.estado,
        comprobante: pago.comprobante,
        comprobanteClinica: pago.comprobante_clinica,
        fechaPago: pago.fecha_pago,
        createdAt: pago.created_at
      })) || []
      
      console.log('✅ Pagos obtenidos:', transformedData.length)
      return transformedData
    } catch (err) {
      console.error('❌ Error en getPagos:', err)
      throw err
    }
  },

  async createPago(pago) {
    console.log('🔄 Creando pago:', pago)
    try {
      const pagoData = {
        profesional_id: pago.profesionalId,
        paciente: pago.paciente,
        metodo_pago: pago.metodoPago,
        fecha: pago.fecha,
        hora: pago.hora,
        monto: pago.monto,
        porcentaje_profesional: pago.porcentajeProfesional,
        ganancia_profesional: pago.gananciaProfesional,
        ganancia_clinica: pago.gananciaClinica,
        estado: pago.estado,
        comprobante: pago.comprobante,
        comprobante_clinica: pago.comprobanteClinica
      }

      const { data, error } = await supabase
        .from('pagos')
        .insert([pagoData])
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creando pago:', error)
        throw error
      }
      
      console.log('✅ Pago creado:', data)
      return data
    } catch (err) {
      console.error('❌ Error en createPago:', err)
      throw err
    }
  },

  async updatePago(id, updates) {
    console.log('🔄 Actualizando pago:', id, updates)
    try {
      // Convertir keys del frontend a snake_case para la DB
      const dbUpdates = {}
      if (updates.estado) dbUpdates.estado = updates.estado
      if (updates.comprobante) dbUpdates.comprobante = updates.comprobante
      if (updates.comprobanteClinica) dbUpdates.comprobante_clinica = updates.comprobanteClinica
      if (updates.fechaPago) dbUpdates.fecha_pago = updates.fechaPago

      const { data, error } = await supabase
        .from('pagos')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error actualizando pago:', error)
        throw error
      }
      
      console.log('✅ Pago actualizado:', data)
      return data
    } catch (err) {
      console.error('❌ Error en updatePago:', err)
      throw err
    }
  },

  async deletePago(id) {
    console.log('🔄 Eliminando pago:', id)
    try {
      const { error } = await supabase
        .from('pagos')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('❌ Error eliminando pago:', error)
        throw error
      }
      
      console.log('✅ Pago eliminado:', id)
    } catch (err) {
      console.error('❌ Error en deletePago:', err)
      throw err
    }
  }
}

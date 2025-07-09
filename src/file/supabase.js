import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl ? 'Presente' : 'Faltante')
console.log('Supabase Key:', supabaseAnonKey ? 'Presente' : 'Faltante')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables de entorno faltantes:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Presente' : 'Faltante')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funciones de la base de datos
export const db = {
  // PROFESIONALES
  async getProfesionales() {
    const { data, error } = await supabase
      .from('profesionales')
      .select('*')
      .order('nombre')
    
    if (error) throw error
    return data || []
  },

  async createProfesional(profesional) {
    const { data, error } = await supabase
      .from('profesionales')
      .insert([profesional])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfesional(id, updates) {
    const { data, error } = await supabase
      .from('profesionales')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteProfesional(id) {
    const { error } = await supabase
      .from('profesionales')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // PAGOS
  async getPagos() {
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
    
    if (error) throw error
    
    // Transformar datos para compatibilidad con el frontend
    return data?.map(pago => ({
      id: pago.id,
      profesionalId: pago.profesional_id,
      profesionalNombre: pago.profesionales.nombre,
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
  },

  async createPago(pago) {
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
    
    if (error) throw error
    return data
  },

  async updatePago(id, updates) {
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
    
    if (error) throw error
    return data
  },

  async deletePago(id) {
    const { error } = await supabase
      .from('pagos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // LOGS
  async getLogs() {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000) // Limitar a últimos 1000 logs
    
    if (error) throw error
    
    return data?.map(log => ({
      id: log.id,
      timestamp: log.created_at,
      tipo: log.tipo,
      descripcion: log.descripcion,
      detalles: log.detalles || {},
      usuario: log.usuario
    })) || []
  },

  async createLog(log) {
    const { data, error } = await supabase
      .from('logs')
      .insert([{
        tipo: log.tipo,
        descripcion: log.descripcion,
        detalles: log.detalles,
        usuario: log.usuario || 'Admin'
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // UTILIDADES
  async clearAllData() {
    // Limpiar en orden (pagos primero por foreign key)
    await supabase.from('logs').delete().neq('id', 0)
    await supabase.from('pagos').delete().neq('id', 0)
    await supabase.from('profesionales').delete().neq('id', 0)
  }
}

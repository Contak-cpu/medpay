# 🚀 Configuración de Supabase para MedPay AI

## 📋 Requisitos Previos

1. **Cuenta de Supabase**: Crear en [supabase.com](https://supabase.com)
2. **Proyecto configurado**: Con las tablas creadas según el schema proporcionado

## 🔧 Configuración del Proyecto

### 1. Variables de Entorno

Asegúrate de tener las siguientes variables en tu archivo `.env.local`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2. Configuración en Vercel

Para el despliegue en Vercel, agrega las variables de entorno en:
1. Dashboard de Vercel → Tu proyecto → Settings → Environment Variables
2. Agrega las mismas variables que tienes en `.env.local`

### 3. Estructura de Base de Datos

Ya tienes el schema configurado con:
- ✅ Tabla `profesionales`
- ✅ Tabla `pagos` 
- ✅ Tabla `logs`
- ✅ Índices y triggers
- ✅ RLS habilitado

## 🔐 Configuración de Seguridad

### Row Level Security (RLS)

Las políticas actuales permiten todas las operaciones. Para producción, considera:

```sql
-- Política más restrictiva para profesionales
CREATE POLICY "Users can view own profesionales" ON profesionales
    FOR SELECT USING (auth.uid() = user_id);

-- Política para pagos
CREATE POLICY "Users can manage own pagos" ON pagos
    FOR ALL USING (auth.uid() = user_id);
```

### Autenticación (Opcional)

Si quieres agregar autenticación:

```javascript
// En src/lib/supabase.js
export const auth = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },
  
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  },
  
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }
}
```

## 📊 Monitoreo y Analytics

### 1. Dashboard de Supabase

Accede a tu dashboard para:
- 📈 Ver métricas de uso
- 🔍 Revisar logs de consultas
- 🛠️ Gestionar la base de datos

### 2. Logs de Aplicación

Los logs se guardan automáticamente en la tabla `logs` con:
- Tipo de acción
- Descripción detallada
- Detalles en formato JSON
- Timestamp automático

## 🚀 Despliegue

### 1. Vercel

```bash
# Conectar con GitHub
git add .
git commit -m "Integración Supabase completa"
git push origin main

# En Vercel Dashboard
# 1. Conectar repositorio
# 2. Configurar variables de entorno
# 3. Deploy automático
```

### 2. Variables de Entorno en Vercel

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"

1. Verifica que las variables estén en `.env.local`
2. Reinicia el servidor de desarrollo
3. En producción, verifica las variables en Vercel

### Error: "Network error"

1. Verifica la URL de Supabase
2. Revisa las políticas RLS
3. Confirma que la API key sea correcta

### Error: "Foreign key constraint"

1. Verifica que los IDs de profesionales existan
2. Revisa la integridad referencial
3. Usa transacciones para operaciones complejas

## 📈 Optimizaciones

### 1. Índices Adicionales

```sql
-- Para búsquedas por fecha
CREATE INDEX idx_pagos_fecha_estado ON pagos(fecha, estado);

-- Para reportes
CREATE INDEX idx_pagos_profesional_fecha ON pagos(profesional_id, fecha);
```

### 2. Funciones de Base de Datos

```sql
-- Función para calcular estadísticas
CREATE OR REPLACE FUNCTION calcular_estadisticas_diarias(fecha_consulta DATE)
RETURNS TABLE (
  total_efectivo DECIMAL,
  total_transferencias DECIMAL,
  cantidad_pagos INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN metodo_pago = 'efectivo' THEN monto ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN metodo_pago = 'transferencia' THEN monto ELSE 0 END), 0),
    COUNT(*)
  FROM pagos 
  WHERE fecha = fecha_consulta;
END;
$$ LANGUAGE plpgsql;
```

## 🔄 Sincronización en Tiempo Real

Para agregar sincronización en tiempo real:

```javascript
// En useSupabase.js
useEffect(() => {
  const subscription = supabase
    .channel('pagos_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'pagos' },
      (payload) => {
        console.log('Change received!', payload)
        refreshData()
      }
    )
    .subscribe()

  return () => subscription.unsubscribe()
}, [])
```

## 📱 PWA (Progressive Web App)

Para convertir en PWA:

1. **Manifest**: Crear `public/manifest.json`
2. **Service Worker**: Implementar cache
3. **Offline**: Sincronización cuando vuelva online

## 🎯 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Roles y permisos
- [ ] Backup automático
- [ ] Notificaciones push
- [ ] Analytics avanzado
- [ ] Exportación automática

---

**¡Tu aplicación MedPay AI está lista para producción con Supabase! 🚀** 
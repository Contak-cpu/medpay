# 🚀 Instrucciones para Deploy en Vercel - MedPay AI

## 📋 Información del Proyecto

- **Repositorio**: https://github.com/nfranz11/medpay-ai
- **Branch de Producción**: `production/vercel-ready`
- **Framework**: Vite + React
- **Base de Datos**: Supabase

## 🔧 Configuración Requerida

### 1. Variables de Entorno en Vercel

**IMPORTANTE**: Configurar estas variables en Vercel Dashboard → Settings → Environment Variables

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2. Configuración del Proyecto en Vercel

1. **Conectar Repositorio**:
   - Ve a [vercel.com](https://vercel.com)
   - Importa el repositorio: `nfranz11/medpay-ai`
   - Selecciona el framework: **Vite**

2. **Configurar Branch de Producción**:
   - En Settings → Git → Production Branch
   - Cambiar a: `production/vercel-ready`

3. **Build Settings** (automático):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 🎯 Pasos para el Deploy

### Opción 1: Deploy Automático (Recomendado)

1. **Fork del Repositorio**:
   ```bash
   # La persona con acceso a Vercel debe hacer fork
   git clone https://github.com/nfranz11/medpay-ai.git
   cd medpay-ai
   git checkout production/vercel-ready
   ```

2. **Configurar en Vercel**:
   - Importar el repositorio fork
   - Configurar variables de entorno
   - Deploy automático

### Opción 2: Deploy Manual

1. **Clonar y Preparar**:
   ```bash
   git clone https://github.com/nfranz11/medpay-ai.git
   cd medpay-ai
   git checkout production/vercel-ready
   npm install
   ```

2. **Crear .env.local**:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

3. **Deploy desde Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

## 🔐 Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda la URL y Anon Key

### 2. Configurar Base de Datos

Ejecutar este SQL en Supabase SQL Editor:

```sql
-- Tabla de profesionales
CREATE TABLE profesionales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  especialidad VARCHAR(255) NOT NULL,
  porcentaje DECIMAL(5,2) NOT NULL,
  valor_turno DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  profesional_id INTEGER REFERENCES profesionales(id),
  paciente VARCHAR(255) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  porcentaje_profesional DECIMAL(5,2) NOT NULL,
  ganancia_profesional DECIMAL(10,2) NOT NULL,
  ganancia_clinica DECIMAL(10,2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  comprobante VARCHAR(255),
  comprobante_clinica VARCHAR(255),
  fecha_pago TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de logs
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  datos JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo para desarrollo)
CREATE POLICY "Allow all operations" ON profesionales FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON pagos FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON logs FOR ALL USING (true);
```

## 🚀 Verificación del Deploy

### 1. Verificar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:
- ✅ `VITE_SUPABASE_URL` configurado
- ✅ `VITE_SUPABASE_ANON_KEY` configurado

### 2. Verificar Build

En Vercel Dashboard → Deployments:
- ✅ Build exitoso
- ✅ Sin errores de compilación

### 3. Verificar Funcionalidad

Una vez deployado, verificar:
- ✅ Aplicación carga correctamente
- ✅ Conexión con Supabase funciona
- ✅ CRUD de profesionales funciona
- ✅ CRUD de pagos funciona
- ✅ Reportes y exportación funcionan

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"

**Solución**: Verificar que las variables estén configuradas en Vercel

### Error: "Network error"

**Solución**: 
1. Verificar URL de Supabase
2. Verificar políticas RLS
3. Verificar API key

### Error: "Build failed"

**Solución**:
1. Verificar que esté en el branch correcto
2. Verificar dependencias en package.json
3. Revisar logs de build en Vercel

## 📞 Contacto

- **Desarrollador**: Contak-cpu
- **Repositorio**: https://github.com/nfranz11/medpay-ai
- **Branch de Producción**: `production/vercel-ready`

## 🎯 Notas Importantes

1. **No hacer commits automáticos**: El deploy debe ser manual para evitar errores de permisos
2. **Usar Supabase en producción**: La app está configurada para usar Supabase, no datos de testeo
3. **Variables de entorno obligatorias**: Sin ellas la app no funcionará
4. **Branch específico**: Usar `production/vercel-ready` para el deploy

---

**✅ Listo para Deploy**: Todo el código está preparado y listo para ser deployado en Vercel. 
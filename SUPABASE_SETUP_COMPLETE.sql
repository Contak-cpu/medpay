-- 🚀 SQL Completo para Configurar Supabase - MedPay AI
-- Proyecto: kffadrkeafvyqyojogsz
-- URL: https://supabase.com/dashboard/project/kffadrkeafvyqyojogsz/editor

-- =====================================================
-- CONFIGURACIÓN DE TABLAS
-- =====================================================

-- 1. TABLA DE PROFESIONALES
CREATE TABLE IF NOT EXISTS profesionales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  especialidad VARCHAR(255) NOT NULL,
  porcentaje DECIMAL(5,2) NOT NULL CHECK (porcentaje >= 0 AND porcentaje <= 100),
  valor_turno DECIMAL(10,2) NOT NULL CHECK (valor_turno > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE PAGOS
CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  profesional_id INTEGER NOT NULL REFERENCES profesionales(id) ON DELETE CASCADE,
  paciente VARCHAR(255) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL CHECK (metodo_pago IN ('efectivo', 'transferencia')),
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  porcentaje_profesional DECIMAL(5,2) NOT NULL,
  ganancia_profesional DECIMAL(10,2) NOT NULL,
  ganancia_clinica DECIMAL(10,2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'recibida', 'completada')),
  comprobante VARCHAR(255),
  comprobante_clinica VARCHAR(255),
  fecha_pago TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE LOGS
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  datos JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para profesionales
CREATE INDEX IF NOT EXISTS idx_profesionales_nombre ON profesionales(nombre);
CREATE INDEX IF NOT EXISTS idx_profesionales_especialidad ON profesionales(especialidad);

-- Índices para pagos
CREATE INDEX IF NOT EXISTS idx_pagos_profesional_id ON pagos(profesional_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos(fecha);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_metodo_pago ON pagos(metodo_pago);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha_estado ON pagos(fecha, estado);
CREATE INDEX IF NOT EXISTS idx_pagos_profesional_fecha ON pagos(profesional_id, fecha);

-- Índices para logs
CREATE INDEX IF NOT EXISTS idx_logs_tipo ON logs(tipo);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at);

-- =====================================================
-- FUNCIONES DE ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profesionales_updated_at 
    BEFORE UPDATE ON profesionales 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pagos_updated_at 
    BEFORE UPDATE ON pagos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIONES DE CÁLCULO
-- =====================================================

-- Función para calcular estadísticas diarias
CREATE OR REPLACE FUNCTION calcular_estadisticas_diarias(fecha_consulta DATE)
RETURNS TABLE (
  total_efectivo DECIMAL,
  total_transferencias DECIMAL,
  cantidad_pagos INTEGER,
  ganancia_total_profesionales DECIMAL,
  ganancia_total_clinica DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN metodo_pago = 'efectivo' THEN monto ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN metodo_pago = 'transferencia' THEN monto ELSE 0 END), 0),
    COUNT(*),
    COALESCE(SUM(ganancia_profesional), 0),
    COALESCE(SUM(ganancia_clinica), 0)
  FROM pagos 
  WHERE fecha = fecha_consulta;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener reporte por profesional
CREATE OR REPLACE FUNCTION obtener_reporte_profesional(
  profesional_id_param INTEGER,
  fecha_desde DATE DEFAULT NULL,
  fecha_hasta DATE DEFAULT NULL
)
RETURNS TABLE (
  profesional_id INTEGER,
  profesional_nombre VARCHAR,
  especialidad VARCHAR,
  total_consultas BIGINT,
  total_facturado DECIMAL,
  ganancia_profesional DECIMAL,
  ganancia_clinica DECIMAL,
  efectivos_cantidad BIGINT,
  efectivos_monto DECIMAL,
  transferencias_cantidad BIGINT,
  transferencias_monto DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.profesional_id,
    prof.nombre,
    prof.especialidad,
    COUNT(*),
    SUM(p.monto),
    SUM(p.ganancia_profesional),
    SUM(p.ganancia_clinica),
    COUNT(CASE WHEN p.metodo_pago = 'efectivo' THEN 1 END),
    SUM(CASE WHEN p.metodo_pago = 'efectivo' THEN p.monto ELSE 0 END),
    COUNT(CASE WHEN p.metodo_pago = 'transferencia' THEN 1 END),
    SUM(CASE WHEN p.metodo_pago = 'transferencia' THEN p.monto ELSE 0 END)
  FROM pagos p
  JOIN profesionales prof ON p.profesional_id = prof.id
  WHERE p.profesional_id = profesional_id_param
    AND (fecha_desde IS NULL OR p.fecha >= fecha_desde)
    AND (fecha_hasta IS NULL OR p.fecha <= fecha_hasta)
  GROUP BY p.profesional_id, prof.nombre, prof.especialidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Políticas para profesionales (permitir todo para desarrollo)
CREATE POLICY "Allow all operations on profesionales" ON profesionales
    FOR ALL USING (true);

-- Políticas para pagos (permitir todo para desarrollo)
CREATE POLICY "Allow all operations on pagos" ON pagos
    FOR ALL USING (true);

-- Políticas para logs (permitir todo para desarrollo)
CREATE POLICY "Allow all operations on logs" ON logs
    FOR ALL USING (true);

-- =====================================================
-- DATOS DE PRUEBA (OPCIONAL)
-- =====================================================

-- Insertar algunos profesionales de prueba
INSERT INTO profesionales (nombre, especialidad, porcentaje, valor_turno) VALUES
('Dr. García', 'Cardiología', 70.00, 50000.00),
('Dra. López', 'Dermatología', 75.00, 45000.00),
('Dr. Martínez', 'Neurología', 80.00, 60000.00),
('Dra. Pérez', 'Pediatría', 65.00, 40000.00)
ON CONFLICT DO NOTHING;

-- Insertar algunos pagos de prueba
INSERT INTO pagos (profesional_id, paciente, metodo_pago, fecha, hora, monto, porcentaje_profesional, ganancia_profesional, ganancia_clinica, estado) VALUES
(1, 'Juan Pérez', 'efectivo', CURRENT_DATE, '09:00', 50000, 70.00, 35000, 15000, 'pendiente'),
(2, 'María García', 'transferencia', CURRENT_DATE, '10:30', 45000, 75.00, 33750, 11250, 'recibida'),
(3, 'Carlos López', 'efectivo', CURRENT_DATE - INTERVAL '1 day', '14:00', 60000, 80.00, 48000, 12000, 'pagado'),
(4, 'Ana Martínez', 'transferencia', CURRENT_DATE - INTERVAL '2 days', '11:15', 40000, 65.00, 26000, 14000, 'completada')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CONFIGURACIÓN DE VARIABLES DE ENTORNO
-- =====================================================

/*
VARIABLES PARA CONFIGURAR EN VERCEL:

VITE_SUPABASE_URL=https://kffadrkeafvyqyojogsz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZmFkcmtlYWZ2eXF5b2pvZ3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTcwOTAsImV4cCI6MjA2NzY5MzA5MH0.oNF2xPAASfmNzwVJIlSgTWCoT-5V7VCsPqbOpMZqM80

*/

-- =====================================================
-- VERIFICACIÓN DE INSTALACIÓN
-- =====================================================

-- Verificar que las tablas se crearon correctamente
SELECT 
  'profesionales' as tabla,
  COUNT(*) as registros
FROM profesionales
UNION ALL
SELECT 
  'pagos' as tabla,
  COUNT(*) as registros
FROM pagos
UNION ALL
SELECT 
  'logs' as tabla,
  COUNT(*) as registros
FROM logs;

-- Verificar índices
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('profesionales', 'pagos', 'logs')
ORDER BY tablename, indexname;

-- ✅ CONFIGURACIÓN COMPLETA
-- La base de datos está lista para usar con MedPay AI 
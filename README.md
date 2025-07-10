# 🚀 MedPay AI - Sistema de Gestión de Pagos

Sistema completo de gestión de pagos para consultorios médicos con React, Vite, Tailwind CSS y Supabase.

## 🎯 Características

- ✅ **Gestión de Profesionales**: CRUD completo con estadísticas
- ✅ **Gestión de Pagos**: Registro de efectivo y transferencias
- ✅ **Dashboard Inteligente**: Métricas en tiempo real
- ✅ **Reportes Avanzados**: Filtros y exportación CSV
- ✅ **Responsive Design**: Optimizado para móviles
- ✅ **Base de Datos**: Supabase con PostgreSQL
- ✅ **Performance**: Lazy loading y optimizaciones

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Estado**: Zustand
- **Base de Datos**: Supabase (PostgreSQL)
- **Iconos**: Lucide React
- **Testing**: Vitest + Testing Library

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/Contak-cpu/medpay.git
cd medpay

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.local .env.local

# Ejecutar en desarrollo
npm run dev
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_SUPABASE_URL=https://kffadrkeafvyqyojogsz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZmFkcmtlYWZ2eXF5b2pvZ3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTcwOTAsImV4cCI6MjA2NzY5MzA5MH0.oNF2xPAASfmNzwVJIlSgTWCoT-5V7VCsPqbOpMZqM80
```

## 📊 Funcionalidades

### Dashboard
- Estadísticas en tiempo real
- Pagos recientes
- Métricas de rendimiento

### Profesionales
- Agregar/editar/eliminar profesionales
- Ver detalles y estadísticas
- Validaciones en tiempo real

### Pagos
- Registrar pagos (efectivo/transferencia)
- Cálculo automático de ganancias
- Estados de pago

### Reportes
- Filtros avanzados
- Exportación CSV
- Métricas por período

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con UI
npm run test:ui

# Coverage
npm run test:coverage
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run test         # Ejecutar tests
npm run lint         # Linting
npm run format       # Formatear código
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/     # Componentes React
├── hooks/         # Hooks personalizados
├── store/         # Estado global (Zustand)
├── file/          # Configuración de Supabase
├── config/        # Configuración de entorno
├── data/          # Datos de testeo
└── utils/         # Utilidades
```

## 🚀 Deploy

El proyecto está configurado para deploy automático en Vercel. Solo necesitas:

1. Conectar el repositorio en Vercel
2. Configurar las variables de entorno
3. Deploy automático en cada push

## 📞 Contacto

- **Desarrollador**: Contak-cpu
- **Repositorio**: https://github.com/Contak-cpu/medpay

---

**✅ Listo para producción**: Sistema completo y optimizado para consultorios médicos.
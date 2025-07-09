# MedPay AI - Sistema de Gestión de Pagos para Consultorios Médicos

## 🏥 Descripción

MedPay AI es una aplicación web moderna para la gestión integral de pagos en consultorios médicos. Permite administrar profesionales, registrar pagos, generar reportes y hacer seguimiento de deudas de manera eficiente.

## ✨ Características Principales

### 📱 **Diseño Responsive**
- **Mobile First**: Optimizado para dispositivos móviles
- **Navegación Adaptativa**: Menú hamburguesa en móviles, tabs horizontales en desktop
- **Grids Responsivos**: Se adaptan automáticamente a diferentes tamaños de pantalla
- **Formularios Optimizados**: Campos que se ajustan a pantallas pequeñas
- **Modales Responsivos**: Adaptados para uso táctil en móviles

### 🎯 **Funcionalidades**

#### Gestión de Profesionales
- Agregar médicos con nombre, especialidad y porcentaje de ganancia
- Calcular automáticamente ganancias por turno
- Visualizar información en tarjetas responsive

#### Registro de Pagos
- Registrar pagos con método (efectivo/transferencia)
- Asignar a profesionales específicos
- Incluir comprobantes opcionales
- Formularios adaptados a móviles

#### Dashboard Inteligente
- Estadísticas en tiempo real
- Cards responsive con información clave
- Lista de pagos recientes
- Indicadores visuales de estado

#### Estado de Deudas
- Seguimiento de pagos pendientes
- Filtros por profesional y método
- Marcado masivo de pagos
- Vista optimizada para móviles

#### Reportes Detallados
- Estadísticas generales y por profesional
- Exportación a CSV
- Filtros avanzados
- Gráficos responsive

#### Sistema de Logs
- Registro completo de actividades
- Historial de transacciones
- Interfaz adaptativa

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Iconos**: Lucide React
- **Base de Datos**: Supabase (configurado)
- **Hosting**: Vercel

## 📱 Responsive Design

### Breakpoints Implementados
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (sm-lg)
- **Desktop**: > 1024px (lg+)

### Mejoras Responsive
- ✅ Navegación móvil con menú hamburguesa
- ✅ Grids que se adaptan a pantallas pequeñas
- ✅ Textos y espaciados responsivos
- ✅ Formularios optimizados para touch
- ✅ Modales con padding adaptativo
- ✅ Scroll mejorado en dispositivos móviles
- ✅ Prevención de zoom en inputs (iOS)

## 🚀 Instalación y Uso

```bash
# Clonar repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📊 Estructura del Proyecto

```
medpay-ai/
├── src/
│   ├── components/
│   │   └── MedPayApp.jsx      # Componente principal
│   ├── styles/
│   │   └── globals.css         # Estilos globales responsive
│   └── main.jsx               # Punto de entrada
├── public/
├── tailwind.config.js         # Configuración de Tailwind
└── package.json
```

## 🎨 Características de Diseño

### Tema Oscuro
- Gradientes púrpura y azul
- Efectos de blur y transparencia
- Iconografía moderna
- Animaciones suaves

### UX/UI Responsive
- **Mobile First**: Diseñado primero para móviles
- **Touch Friendly**: Botones y elementos táctiles
- **Legible**: Tipografía optimizada para cada dispositivo
- **Accesible**: Contraste y tamaños apropiados

## 🔧 Configuración para Vercel

El proyecto está optimizado para despliegue en Vercel con:

- Build automático desde GitHub
- Configuración de rutas para SPA
- Optimización de assets
- CDN global

## 📈 Próximas Mejoras

- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Sincronización en tiempo real
- [ ] Analytics integrado
- [ ] Temas personalizables

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

---

**Desarrollado con ❤️ para consultorios médicos modernos**
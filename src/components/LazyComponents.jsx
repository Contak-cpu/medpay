import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component para lazy loading
const LoadingSpinner = ({ message = "Cargando..." }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-2" />
      <p className="text-purple-300 text-sm">{message}</p>
    </div>
  </div>
);

// Wrapper para componentes lazy
export const LazyComponent = ({ children, fallback = <LoadingSpinner /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Componentes lazy individuales
export const LazyDashboard = React.lazy(() => import('./Dashboard/Dashboard'));
export const LazyReportes = React.lazy(() => import('./Reportes/Reportes'));
export const LazyDeudas = React.lazy(() => import('./Deudas/Deudas'));
export const LazyProfesionales = React.lazy(() => import('./Profesionales/Profesionales'));
export const LazyPagosList = React.lazy(() => import('./Pagos/PagosList'));
export const LazyRegistroPagos = React.lazy(() => import('./RegistroPagos/RegistroPagos'));

// Modales lazy
export const LazyAddProfesionalModal = React.lazy(() => import('./Profesionales/AddProfesionalModal'));
export const LazyEditProfesionalModal = React.lazy(() => import('./Profesionales/EditProfesionalModal'));
export const LazyAddPagoModal = React.lazy(() => import('./Pagos/AddPagoModal'));
export const LazyMarcarPagoModal = React.lazy(() => import('./Deudas/MarcarPagoModal'));
export const LazyExportModal = React.lazy(() => import('./Reportes/ExportModal'));

// HOC para componentes con loading específico
export const withLazyLoading = (Component, loadingMessage) => {
  return (props) => (
    <LazyComponent fallback={<LoadingSpinner message={loadingMessage} />}>
      <Component {...props} />
    </LazyComponent>
  );
}; 
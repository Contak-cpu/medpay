import React from 'react'
import ReactDOM from 'react-dom/client'
import MedPayApp from './components/MedPayApp.jsx'
import './styles/globals.css'

// Cargar analytics de forma lazy para no bloquear la carga inicial
const ErrorBoundaryWithAnalytics = React.lazy(() => import('./components/ErrorBoundary.jsx'));

// Componente wrapper optimizado
const AppWithAnalytics = () => {
  const [analyticsLoaded, setAnalyticsLoaded] = React.useState(false);
  
  React.useEffect(() => {
    // Cargar analytics de forma asíncrona después de que la app esté lista
    const loadAnalytics = async () => {
      try {
        const { useAnalytics } = await import('./hooks/useAnalytics.js');
        const { trackPage } = useAnalytics();
        trackPage(window.location.pathname);
        setAnalyticsLoaded(true);
      } catch (error) {
        console.warn('Analytics no disponible:', error);
      }
    };

    // Delay para no bloquear la carga inicial
    const timer = setTimeout(loadAnalytics, 1000);
    return () => clearTimeout(timer);
  }, []);

  return <MedPayApp />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback={<MedPayApp />}>
      <ErrorBoundaryWithAnalytics>
        <AppWithAnalytics />
      </ErrorBoundaryWithAnalytics>
    </React.Suspense>
  </React.StrictMode>,
)

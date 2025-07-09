import { useEffect, useCallback } from 'react';

// Configuración de analytics
const ANALYTICS_CONFIG = {
  enabled: import.meta.env.PROD,
  trackingId: import.meta.env.VITE_GA_TRACKING_ID,
  errorReporting: import.meta.env.VITE_SENTRY_DSN
};

// Hook para analytics
export const useAnalytics = () => {
  // Inicializar Google Analytics
  useEffect(() => {
    if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.trackingId) {
      // Cargar Google Analytics
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.trackingId}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', ANALYTICS_CONFIG.trackingId);

      window.gtag = gtag;
    }
  }, []);

  // Track eventos
  const trackEvent = useCallback((action, category, label, value) => {
    if (ANALYTICS_CONFIG.enabled && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
    
    // Log local para desarrollo
    console.log('📊 Analytics Event:', { action, category, label, value });
  }, []);

  // Track páginas
  const trackPage = useCallback((page) => {
    if (ANALYTICS_CONFIG.enabled && window.gtag) {
      window.gtag('config', ANALYTICS_CONFIG.trackingId, {
        page_path: page
      });
    }
    
    console.log('📊 Page View:', page);
  }, []);

  // Track errores
  const trackError = useCallback((error, context = {}) => {
    if (ANALYTICS_CONFIG.enabled && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        ...context
      });
    }
    
    console.error('❌ Error Tracked:', error, context);
  }, []);

  // Track métricas de performance
  const trackPerformance = useCallback((metric) => {
    if (ANALYTICS_CONFIG.enabled && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: metric.name,
        value: metric.value,
        event_category: 'Performance'
      });
    }
    
    console.log('⚡ Performance Metric:', metric);
  }, []);

  return {
    trackEvent,
    trackPage,
    trackError,
    trackPerformance,
    isEnabled: ANALYTICS_CONFIG.enabled
  };
};

// Hook para error boundaries
export const useErrorBoundary = () => {
  const captureError = useCallback((error, errorInfo) => {
    // Enviar a Sentry si está configurado
    if (ANALYTICS_CONFIG.errorReporting) {
      // Aquí se integraría Sentry
      console.error('🚨 Error Boundary:', error, errorInfo);
    }
    
    // Log local
    console.error('🚨 Unhandled Error:', error);
    console.error('🚨 Error Info:', errorInfo);
  }, []);

  return { captureError };
}; 
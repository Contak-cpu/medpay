import { useEffect, useCallback, useRef } from 'react';

// Hook para métricas de performance
export const usePerformance = () => {
  const observerRef = useRef(null);

  // Medir Core Web Vitals
  const measureWebVitals = useCallback(() => {
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('⚡ LCP:', lastEntry.startTime);
        
        // Enviar a analytics si está disponible
        if (window.gtag) {
          window.gtag('event', 'timing_complete', {
            name: 'LCP',
            value: Math.round(lastEntry.startTime),
            event_category: 'Web Vitals'
          });
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('⚡ FID:', entry.processingStart - entry.startTime);
          
          if (window.gtag) {
            window.gtag('event', 'timing_complete', {
              name: 'FID',
              value: Math.round(entry.processingStart - entry.startTime),
              event_category: 'Web Vitals'
            });
          }
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        console.log('⚡ CLS:', clsValue);
        
        if (window.gtag) {
          window.gtag('event', 'timing_complete', {
            name: 'CLS',
            value: Math.round(clsValue * 1000),
            event_category: 'Web Vitals'
          });
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }, []);

  // Medir tiempo de carga de componentes
  const measureComponentLoad = useCallback((componentName) => {
    const startTime = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTime;
      console.log(`⚡ ${componentName} load time:`, Math.round(loadTime), 'ms');
      
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: `${componentName}_load`,
          value: Math.round(loadTime),
          event_category: 'Component Performance'
        });
      }
    };
  }, []);

  // Medir memoria
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = performance.memory;
      console.log('💾 Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
      });
      
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: 'memory_usage',
          value: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          event_category: 'Performance'
        });
      }
    }
  }, []);

  // Optimizar imágenes
  const optimizeImage = useCallback((src, options = {}) => {
    const { width, height, quality = 0.8 } = options;
    
    // Si es una imagen local, agregar parámetros de optimización
    if (src.startsWith('/')) {
      const params = new URLSearchParams();
      if (width) params.append('w', width);
      if (height) params.append('h', height);
      if (quality) params.append('q', quality);
      
      return `${src}?${params.toString()}`;
    }
    
    return src;
  }, []);

  // Preload recursos críticos
  const preloadResource = useCallback((href, as = 'script') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }, []);

  // Inicializar métricas
  useEffect(() => {
    measureWebVitals();
    
    // Medir memoria cada 30 segundos
    const memoryInterval = setInterval(measureMemory, 30000);
    
    return () => {
      clearInterval(memoryInterval);
    };
  }, [measureWebVitals, measureMemory]);

  return {
    measureComponentLoad,
    optimizeImage,
    preloadResource,
    measureMemory
  };
}; 
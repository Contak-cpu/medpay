import { useState, useCallback, useRef } from 'react';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const timeoutRefs = useRef({});

  const showNotification = useCallback((type, message, duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      type,
      message,
      timestamp: Date.now()
    };

    setNotifications(prev => [...prev, notification]);

    // Limpiar timeout anterior si existe
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
    }

    // Auto-remover después del tiempo especificado
    timeoutRefs.current[id] = setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // Limpiar timeout
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    
    // Limpiar todos los timeouts
    Object.values(timeoutRefs.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    timeoutRefs.current = {};
  }, []);

  // Métodos de conveniencia para diferentes tipos
  const showSuccess = useCallback((message, duration) => {
    return showNotification('success', message, duration);
  }, [showNotification]);

  const showError = useCallback((message, duration) => {
    return showNotification('error', message, duration);
  }, [showNotification]);

  const showWarning = useCallback((message, duration) => {
    return showNotification('warning', message, duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration) => {
    return showNotification('info', message, duration);
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAllNotifications
  };
};

export default useNotifications; 
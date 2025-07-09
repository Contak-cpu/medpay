import React from 'react';
import { Check, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationSystem = ({ notifications, onRemove }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5" />;
      case 'error':
        return <X className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          border: 'border-green-400',
          text: 'text-green-100',
          icon: 'text-green-100'
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          border: 'border-red-400',
          text: 'text-red-100',
          icon: 'text-red-100'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          border: 'border-yellow-400',
          text: 'text-yellow-100',
          icon: 'text-yellow-100'
        };
      case 'info':
        return {
          bg: 'bg-blue-500',
          border: 'border-blue-400',
          text: 'text-blue-100',
          icon: 'text-blue-100'
        };
      default:
        return {
          bg: 'bg-gray-500',
          border: 'border-gray-400',
          text: 'text-gray-100',
          icon: 'text-gray-100'
        };
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => {
        const styles = getStyles(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`${styles.bg} ${styles.border} border rounded-xl shadow-lg p-4 animate-slide-in-right flex items-start space-x-3 max-w-sm`}
          >
            <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
              {getIcon(notification.type)}
            </div>
            
            <div className={`${styles.text} flex-1 text-sm font-medium`}>
              {notification.message}
            </div>
            
            <button
              onClick={() => onRemove(notification.id)}
              className={`${styles.text} hover:opacity-80 transition-opacity flex-shrink-0`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSystem; 
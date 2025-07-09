import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useErrorBoundary } from '../hooks/useAnalytics';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Capturar error con analytics
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-black flex items-center justify-center p-4">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-red-500/20 p-8 max-w-md w-full">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-400 mb-4">Error Inesperado</h2>
              <p className="text-gray-300 mb-6">
                Algo salió mal. El error ha sido registrado y será investigado.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-purple-300 cursor-pointer mb-2">
                    Detalles del Error (Solo Desarrollo)
                  </summary>
                  <div className="bg-black/30 rounded-lg p-3 text-xs text-red-300 font-mono overflow-auto">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 text-xs">{this.state.errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Recargar Página</span>
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Ir al Inicio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper con hook de analytics
export const ErrorBoundaryWithAnalytics = ({ children }) => {
  const { captureError } = useErrorBoundary();
  
  return (
    <ErrorBoundary onError={captureError}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary; 
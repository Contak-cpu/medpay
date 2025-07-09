import React, { useState } from 'react';
import { Eye, Trash2, Calendar, Clock, DollarSign, User, CreditCard, TrendingUp } from 'lucide-react';

export default function PagosList({ pagos, profesionales, onSelect, onDelete }) {
  const [selectedPago, setSelectedPago] = useState(null);

  if (!pagos || pagos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
          <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-purple-300 mb-2">No hay pagos registrados</h3>
          <p className="text-gray-400">Comienza registrando tu primer pago para ver la información aquí.</p>
        </div>
      </div>
    );
  }

  const getEstadoColor = (pago) => {
    if (pago.metodoPago === 'efectivo') {
      return pago.estado === 'pendiente' ? 'bg-orange-500' : 'bg-green-500';
    } else {
      return pago.estado === 'recibida' ? 'bg-blue-500' : 'bg-green-500';
    }
  };

  const getEstadoTexto = (pago) => {
    if (pago.metodoPago === 'efectivo') {
      return pago.estado === 'pendiente' ? 'Debe pagar clínica' : 'Pagado';
    } else {
      return pago.estado === 'recibida' ? 'Comisión pendiente' : 'Completado';
    }
  };

  const getMetodoIcon = (metodo) => {
    return metodo === 'efectivo' ? '💵' : '🏦';
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Pagos</p>
              <p className="text-2xl font-bold text-purple-400">{pagos.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Monto Total</p>
              <p className="text-2xl font-bold text-green-400">
                ${pagos.reduce((sum, p) => sum + p.monto, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Efectivo</p>
              <p className="text-2xl font-bold text-orange-400">
                {pagos.filter(p => p.metodoPago === 'efectivo').length}
              </p>
            </div>
            <span className="text-2xl">💵</span>
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Transferencias</p>
              <p className="text-2xl font-bold text-blue-400">
                {pagos.filter(p => p.metodoPago === 'transferencia').length}
              </p>
            </div>
            <span className="text-2xl">🏦</span>
          </div>
        </div>
      </div>

      {/* Lista de pagos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pagos.map(pago => (
          <div key={pago.id} className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{pago.profesionalNombre}</h3>
                  <p className="text-sm text-gray-400">{pago.paciente}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(pago)}`}>
                {getEstadoTexto(pago)}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getMetodoIcon(pago.metodoPago)}</span>
                  <span className="text-sm text-gray-400 capitalize">{pago.metodoPago}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-400">${pago.monto.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">
                    Ganancia: ${pago.gananciaProfesional.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(pago.fecha).toLocaleDateString('es-AR')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{pago.hora}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedPago(pago);
                  if (onSelect) onSelect(pago);
                }}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 px-3 py-2 rounded-lg text-blue-300 text-sm font-medium transition-all flex items-center justify-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Detalle</span>
              </button>
              <button
                onClick={() => onDelete && onDelete(pago.id)}
                className="bg-red-600/20 hover:bg-red-600/40 px-3 py-2 rounded-lg text-red-300 text-sm font-medium transition-all flex items-center justify-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalle */}
      {selectedPago && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-purple-500/30 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-purple-300">Detalle del Pago</h3>
              <button
                onClick={() => setSelectedPago(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Profesional:</span>
                <span className="font-semibold">{selectedPago.profesionalNombre}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Paciente:</span>
                <span className="font-semibold">{selectedPago.paciente}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Método:</span>
                <span className="font-semibold capitalize">{selectedPago.metodoPago}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Monto:</span>
                <span className="font-semibold text-green-400">${selectedPago.monto.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Ganancia Profesional:</span>
                <span className="font-semibold text-blue-400">${selectedPago.gananciaProfesional.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Ganancia Clínica:</span>
                <span className="font-semibold text-purple-400">${selectedPago.gananciaClinica.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Fecha:</span>
                <span className="font-semibold">{new Date(selectedPago.fecha).toLocaleDateString('es-AR')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Hora:</span>
                <span className="font-semibold">{selectedPago.hora}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(selectedPago)}`}>
                  {getEstadoTexto(selectedPago)}
                </span>
              </div>
              
              {selectedPago.comprobante && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Comprobante:</span>
                  <span className="font-semibold text-sm">{selectedPago.comprobante}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
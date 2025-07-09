import React, { useState } from 'react';
import { DollarSign, Check, X } from 'lucide-react';

const MarcarPagoModal = ({ 
  pago, 
  onConfirm, 
  onCancel, 
  isOpen 
}) => {
  const [montoAbonado, setMontoAbonado] = useState('');
  const [tipoPago, setTipoPago] = useState('total'); // 'total' o 'parcial'
  const [comprobante, setComprobante] = useState('');

  if (!isOpen || !pago) return null;

  const montoTotal = pago.metodoPago === 'efectivo' ? pago.gananciaProfesional : pago.gananciaClinica;
  const montoCalculado = tipoPago === 'total' ? montoTotal : parseFloat(montoAbonado) || 0;

  const handleConfirm = () => {
    onConfirm({
      pagoId: pago.id,
      montoAbonado: montoCalculado,
      tipoPago,
      comprobante: comprobante || null
    });
  };

  const handleCancel = () => {
    setMontoAbonado('');
    setTipoPago('total');
    setComprobante('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-purple-500/30 p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-purple-300">Marcar Pago</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Información del pago */}
          <div className="bg-black/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Profesional:</span>
              <span className="font-semibold">{pago.profesionalNombre}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Paciente:</span>
              <span className="font-semibold">{pago.paciente}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Método:</span>
              <span className="font-semibold capitalize">{pago.metodoPago}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Monto Total:</span>
              <span className="font-semibold text-green-400">${montoTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Tipo de pago */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Tipo de Pago
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setTipoPago('total')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  tipoPago === 'total'
                    ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                    : 'bg-gray-600/20 text-gray-300 border border-gray-500/30'
                }`}
              >
                Pago Total
              </button>
              <button
                onClick={() => setTipoPago('parcial')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  tipoPago === 'parcial'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'bg-gray-600/20 text-gray-300 border border-gray-500/30'
                }`}
              >
                Pago Parcial
              </button>
            </div>
          </div>

          {/* Monto a abonar */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Monto a Abonar
            </label>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <input
                type="number"
                value={tipoPago === 'total' ? montoTotal : montoAbonado}
                onChange={(e) => setMontoAbonado(e.target.value)}
                disabled={tipoPago === 'total'}
                className="flex-1 px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white"
                placeholder="0"
                min="0"
                max={montoTotal}
              />
            </div>
            {tipoPago === 'parcial' && (
              <p className="text-xs text-gray-400 mt-1">
                Máximo: ${montoTotal.toLocaleString()}
              </p>
            )}
          </div>

          {/* Comprobante */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Comprobante (Opcional)
            </label>
            <input
              type="text"
              value={comprobante}
              onChange={(e) => setComprobante(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white"
              placeholder="Número de operación, referencia, etc."
            />
          </div>

          {/* Resumen */}
          <div className="bg-purple-600/10 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Monto a Abonar:</span>
              <span className="font-semibold text-green-400">${montoCalculado.toLocaleString()}</span>
            </div>
            {tipoPago === 'parcial' && montoCalculado < montoTotal && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Pendiente:</span>
                <span className="font-semibold text-orange-400">${(montoTotal - montoCalculado).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={montoCalculado <= 0}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Pago</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarcarPagoModal; 
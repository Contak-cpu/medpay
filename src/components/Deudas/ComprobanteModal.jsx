import React, { useState } from 'react';
import { Check, X, FileImage, CreditCard } from 'lucide-react';

const ComprobanteModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "Ingresar Comprobante",
  message = "Por favor ingresa los datos del comprobante"
}) => {
  const [comprobanteProfesional, setComprobanteProfesional] = useState('');
  const [comprobanteClinica, setComprobanteClinica] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({
      comprobanteProfesional: comprobanteProfesional || null,
      comprobanteClinica: comprobanteClinica || null
    });
    // Limpiar formulario
    setComprobanteProfesional('');
    setComprobanteClinica('');
  };

  const handleCancel = () => {
    setComprobanteProfesional('');
    setComprobanteClinica('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-purple-500/30 p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-purple-300">{title}</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">{message}</p>
          
          {/* Comprobante del Profesional */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center space-x-2">
              <FileImage className="w-4 h-4" />
              <span>Comprobante del Profesional (Opcional)</span>
            </label>
            <input
              type="text"
              value={comprobanteProfesional}
              onChange={(e) => setComprobanteProfesional(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white"
              placeholder="Número de operación, referencia, etc."
            />
          </div>

          {/* Comprobante de la Clínica */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Comprobante de la Clínica (Opcional)</span>
            </label>
            <input
              type="text"
              value={comprobanteClinica}
              onChange={(e) => setComprobanteClinica(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white"
              placeholder="Referencia de pago, transferencia, etc."
            />
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
            className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprobanteModal; 
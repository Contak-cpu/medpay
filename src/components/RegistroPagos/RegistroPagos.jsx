import React from 'react';

const RegistroPagos = ({ 
  newPago, 
  setNewPago, 
  profesionales, 
  handleAddPago 
}) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Registrar Nuevo Pago
        </h2>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Profesional
              </label>
              <select
                value={newPago.profesionalId}
                onChange={(e) => setNewPago({...newPago, profesionalId: e.target.value})}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
              >
                <option value="">Seleccionar profesional</option>
                {profesionales.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - {p.especialidad}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Paciente
              </label>
              <input
                type="text"
                value={newPago.paciente}
                onChange={(e) => setNewPago({...newPago, paciente: e.target.value})}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
                placeholder="Nombre del paciente"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Método de Pago
              </label>
              <select
                value={newPago.metodoPago}
                onChange={(e) => setNewPago({...newPago, metodoPago: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white text-sm sm:text-base"
              >
                <option value="efectivo">💵 Efectivo</option>
                <option value="transferencia">🏦 Transferencia</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Fecha
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={newPago.fecha}
                  onChange={(e) => setNewPago({...newPago, fecha: e.target.value})}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white [color-scheme:dark]"
                  style={{colorScheme: 'dark'}}
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setNewPago({...newPago, fecha: new Date().toISOString().split('T')[0]})}
                    className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-xs transition-all"
                  >
                    Hoy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      setNewPago({...newPago, fecha: yesterday.toISOString().split('T')[0]});
                    }}
                    className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-xs transition-all"
                  >
                    Ayer
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Hora
              </label>
              <input
                type="time"
                value={newPago.hora}
                onChange={(e) => setNewPago({...newPago, hora: e.target.value})}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white [color-scheme:dark]"
                style={{colorScheme: 'dark'}}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Monto ($)
              </label>
              <input
                type="number"
                value={newPago.monto}
                onChange={(e) => setNewPago({...newPago, monto: e.target.value})}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
                placeholder="15000"
              />
            </div>
          </div>

          {/* Campo de comprobante - solo para transferencias */}
          {newPago.metodoPago === 'transferencia' && (
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Comprobante de Transferencia (Opcional)
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newPago.comprobante}
                  onChange={(e) => setNewPago({...newPago, comprobante: e.target.value})}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-white"
                  placeholder="Ej: Número de operación, referencia, etc."
                />
                <p className="text-xs text-gray-400">
                  💡 Puedes agregar el número de operación, CBU, alias o cualquier referencia del comprobante
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleAddPago}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Registrar Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroPagos; 
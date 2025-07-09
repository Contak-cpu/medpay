import React from 'react';
import { Check, CreditCard, Clock, TrendingUp, FileImage } from 'lucide-react';

const Deudas = ({ 
  filtros, 
  setFiltros, 
  profesionales, 
  pagos, 
  stats, 
  aplicarFiltros, 
  getEstadoColor, 
  getEstadoTexto, 
  marcarPagoIndividual, 
  marcarEfectivoPagado, 
  marcarTransferenciasCobradas 
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Estado de Deudas por Profesional
        </h2>
        <button
          onClick={() => setFiltros({...filtros, mostrarFiltros: !filtros.mostrarFiltros})}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
        >
          <span>{filtros.mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros</span>
          <span className={`transition-transform ${filtros.mostrarFiltros ? 'rotate-180' : ''}`}>▼</span>
        </button>
      </div>
      
      {/* Filtros expandibles */}
      {filtros.mostrarFiltros && (
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Profesional</label>
              <select
                value={filtros.profesional}
                onChange={(e) => setFiltros({...filtros, profesional: e.target.value})}
                className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm"
              >
                <option value="">Todos los profesionales</option>
                {profesionales.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Método de Pago</label>
              <select
                value={filtros.metodoPago}
                onChange={(e) => setFiltros({...filtros, metodoPago: e.target.value})}
                className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm"
              >
                <option value="">Todos los métodos</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Fecha Desde</label>
              <input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
                className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm [color-scheme:dark]"
                style={{colorScheme: 'dark'}}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Fecha Hasta</label>
              <input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
                className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm [color-scheme:dark]"
                style={{colorScheme: 'dark'}}
              />
            </div>
          </div>
          
          <button
            onClick={() => setFiltros({profesional: '', metodoPago: '', fechaDesde: '', fechaHasta: '', mostrarFiltros: true})}
            className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Limpiar Filtros
          </button>
        </div>
      )}
      
      {/* Lista de pagos individuales */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">Pagos Pendientes Individuales</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {aplicarFiltros(pagos)
            .filter(pago => {
              // Solo mostrar pagos pendientes o recibidos
              return (pago.metodoPago === 'efectivo' && pago.estado === 'pendiente') || 
                     (pago.metodoPago === 'transferencia' && pago.estado === 'recibida');
            })
            .map(pago => (
              <div key={pago.id} className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getEstadoColor(pago)}`}></div>
                  <div>
                    <p className="font-semibold">{pago.profesionalNombre}</p>
                    <p className="text-sm text-gray-300">{pago.paciente} - {pago.fecha} {pago.hora}</p>
                    <p className="text-xs text-gray-400">{getEstadoTexto(pago)}</p>
                    {pago.comprobante && (
                      <div className="flex items-center space-x-1 mt-1">
                        <FileImage className="w-3 h-3 text-blue-400" />
                        <p className="text-xs text-blue-400">Comprobante: {pago.comprobante}</p>
                      </div>
                    )}
                    {pago.comprobanteClinica && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Check className="w-3 h-3 text-green-400" />
                        <p className="text-xs text-green-400">Pago clínica: {pago.comprobanteClinica}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex items-center space-x-4">
                  <div>
                    <p className="font-semibold">${(pago.monto || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{pago.metodoPago}</p>
                    {pago.metodoPago === 'efectivo' ? (
                      <p className="text-xs text-orange-400">Debe: ${(pago.gananciaProfesional || 0).toLocaleString()}</p>
                    ) : (
                      <p className="text-xs text-blue-400">Comisión: ${(pago.gananciaClinica || 0).toLocaleString()}</p>
                    )}
                  </div>
                  <button
                    onClick={() => marcarPagoIndividual(pago.id, pago.metodoPago)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Marcar Pagado</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      <div className="space-y-6">
        {stats.deudaPorProfesional.map(deuda => (
          <div key={deuda.id} className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-purple-300">{deuda.nombre}</h3>
              <div className="flex space-x-3">
                {deuda.efectivoPendiente > 0 && (
                  <button
                    onClick={() => marcarEfectivoPagado(deuda.id)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Marcar Efectivos Pagados</span>
                  </button>
                )}
                {deuda.comisionPendiente > 0 && (
                  <button
                    onClick={() => marcarTransferenciasCobradas(deuda.id)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Marcar Comisiones Cobradas</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deuda.efectivoPendiente > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="font-semibold text-orange-400">Efectivos Pendientes</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-300">${(deuda.efectivoPendiente || 0).toLocaleString()}</p>
                  <p className="text-sm text-orange-300">{deuda.cantidadEfectivos} pagos pendientes</p>
                </div>
              )}
              
              {deuda.comisionPendiente > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-blue-400">Comisiones Pendientes</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-300">${(deuda.comisionPendiente || 0).toLocaleString()}</p>
                  <p className="text-sm text-blue-300">{deuda.cantidadTransferencias} transferencias</p>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {stats.deudaPorProfesional.length === 0 && (
          <div className="text-center py-12">
            <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-400 mb-2">¡Todo al día!</h3>
            <p className="text-gray-400">No hay deudas pendientes en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deudas; 
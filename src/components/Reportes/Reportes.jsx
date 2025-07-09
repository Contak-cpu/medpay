import React from 'react';
import { DollarSign, User, TrendingUp, Calendar, CreditCard, Upload } from 'lucide-react';

const Reportes = ({ 
  filtrosReportes, 
  setFiltrosReportes, 
  profesionales, 
  calcularReportes, 
  exportarReporteCSV, 
  profesionalDetallado, 
  setProfesionalDetallado,
  calcularDetallesProfesional,
  getEstadoColor,
  onShowExportModal
}) => {
  const reportes = calcularReportes();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Reportes e Ingresos
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={onShowExportModal}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Exportar Reporte</span>
          </button>
          <button
            onClick={() => setFiltrosReportes({...filtrosReportes, mostrarFiltros: !filtrosReportes.mostrarFiltros})}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
          >
            <span>{filtrosReportes.mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros</span>
            <span className={`transition-transform ${filtrosReportes.mostrarFiltros ? 'rotate-180' : ''}`}>▼</span>
          </button>
        </div>
      </div>
      
      {/* Filtros expandibles para reportes */}
      {filtrosReportes.mostrarFiltros && (
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Filtros de Reporte</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Profesional</label>
              <select
                value={filtrosReportes.profesional}
                onChange={(e) => setFiltrosReportes({...filtrosReportes, profesional: e.target.value})}
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
                value={filtrosReportes.metodoPago || ''}
                onChange={(e) => setFiltrosReportes({...filtrosReportes, metodoPago: e.target.value})}
                className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm"
              >
                <option value="">Todos los métodos</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Estado</label>
              <select
                value={filtrosReportes.estado || ''}
                onChange={(e) => setFiltrosReportes({...filtrosReportes, estado: e.target.value})}
                className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="recibida">Recibida</option>
                <option value="pagado">Pagado</option>
                <option value="completada">Completada</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Rango de Monto</label>
              <select
                value={filtrosReportes.rangoMonto || ''}
                onChange={(e) => setFiltrosReportes({...filtrosReportes, rangoMonto: e.target.value})}
                className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm"
              >
                <option value="">Todos los montos</option>
                <option value="0-5000">$0 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-20000">$10,000 - $20,000</option>
                <option value="20000+">Más de $20,000</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Fecha Desde</label>
              <input
                type="date"
                value={filtrosReportes.fechaDesde}
                onChange={(e) => setFiltrosReportes({...filtrosReportes, fechaDesde: e.target.value})}
                className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm [color-scheme:dark]"
                style={{colorScheme: 'dark'}}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Fecha Hasta</label>
              <input
                type="date"
                value={filtrosReportes.fechaHasta}
                onChange={(e) => setFiltrosReportes({...filtrosReportes, fechaHasta: e.target.value})}
                className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm [color-scheme:dark]"
                style={{colorScheme: 'dark'}}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Ordenar Por</label>
              <select
                value={filtrosReportes.ordenar || ''}
                onChange={(e) => setFiltrosReportes({...filtrosReportes, ordenar: e.target.value})}
                className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white text-sm"
              >
                <option value="fecha_desc">Fecha (más reciente)</option>
                <option value="fecha_asc">Fecha (más antigua)</option>
                <option value="monto_desc">Monto (mayor)</option>
                <option value="monto_asc">Monto (menor)</option>
                <option value="profesional">Profesional A-Z</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setFiltrosReportes({
              profesional: '', 
              fechaDesde: '', 
              fechaHasta: '', 
              metodoPago: '',
              estado: '',
              rangoMonto: '',
              ordenar: '',
              mostrarFiltros: true
            })}
            className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Limpiar Filtros
          </button>
        </div>
      )}
      
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl border border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">Total Facturado</p>
              <p className="text-2xl font-bold text-green-400">${(reportes.totalGeneral || 0).toLocaleString()}</p>
              <p className="text-xs text-green-300 mt-1">{reportes.cantidadConsultas} consultas</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl border border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Ganancias Profesionales</p>
              <p className="text-2xl font-bold text-blue-400">${(reportes.totalGananciasProfesionales || 0).toLocaleString()}</p>
              <p className="text-xs text-blue-300 mt-1">Total a pagar</p>
            </div>
            <User className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">Ganancias Clínica</p>
              <p className="text-2xl font-bold text-purple-400">${(reportes.totalGananciasClinica || 0).toLocaleString()}</p>
              <p className="text-xs text-purple-300 mt-1">Comisiones</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-2xl border border-orange-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm font-medium">Promedio x Consulta</p>
              <p className="text-2xl font-bold text-orange-400">
                ${reportes.cantidadConsultas > 0 ? Math.round(reportes.totalGeneral / reportes.cantidadConsultas).toLocaleString() : '0'}
              </p>
              <p className="text-xs text-orange-300 mt-1">Por turno</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>
      
      {/* Desglose por Método de Pago */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">Desglose por Método de Pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-400">Efectivo</span>
            </div>
            <p className="text-2xl font-bold text-green-300">${(reportes.totalEfectivo || 0).toLocaleString()}</p>
            <p className="text-sm text-green-300">
              {Math.round((reportes.totalEfectivo / reportes.totalGeneral) * 100) || 0}% del total
            </p>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-blue-400">Transferencias</span>
            </div>
            <p className="text-2xl font-bold text-blue-300">${(reportes.totalTransferencias || 0).toLocaleString()}</p>
            <p className="text-sm text-blue-300">
              {Math.round((reportes.totalTransferencias / reportes.totalGeneral) * 100) || 0}% del total
            </p>
          </div>
        </div>
      </div>
      
      {/* Reporte por Profesional */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-300">Reporte por Profesional</h3>
          {profesionalDetallado && (
            <button
              onClick={() => setProfesionalDetallado(null)}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1"
            >
              <span>← Volver al Resumen</span>
            </button>
          )}
        </div>
        
        {!profesionalDetallado ? (
          <div className="space-y-4">
            {reportes.reportePorProfesional.map(reporte => (
              <div 
                key={reporte.id} 
                className="bg-black/30 rounded-xl p-4 cursor-pointer hover:bg-black/40 transition-all transform hover:scale-[1.01] border border-transparent hover:border-purple-500/30"
                onClick={() => setProfesionalDetallado(reporte.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{reporte.nombre}</h4>
                    <p className="text-sm text-gray-300">{reporte.especialidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">${(reporte.totalFacturado || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{reporte.cantidadConsultas} consultas</p>
                    <p className="text-xs text-purple-400">👆 Click para detalles</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-300">Ganancia Profesional</p>
                    <p className="font-semibold text-blue-400">${(reporte.gananciaProfesional || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Comisión Clínica</p>
                    <p className="font-semibold text-purple-400">${(reporte.gananciaClinica || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Efectivos</p>
                    <p className="font-semibold text-green-400">
                      {reporte.efectivos.cantidad} - ${(reporte.efectivos.monto || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300">Transferencias</p>
                    <p className="font-semibold text-cyan-400">
                      {reporte.transferencias.cantidad} - ${(reporte.transferencias.monto || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {reportes.reportePorProfesional.length === 0 && (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No hay datos para mostrar con los filtros aplicados</p>
              </div>
            )}
          </div>
        ) : (
          (() => {
            const detalles = calcularDetallesProfesional(profesionalDetallado);
            if (!detalles) return <p className="text-red-400">Error al cargar detalles</p>;
            
            return (
              <div className="space-y-6">
                {/* Header del profesional */}
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{detalles.profesional.nombre}</h3>
                      <p className="text-purple-300">{detalles.profesional.especialidad}</p>
                      <p className="text-sm text-gray-400">
                        {detalles.profesional.porcentaje}% profesional • ${(detalles.profesional.valorTurno || 0).toLocaleString()} por turno
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-400">
                        ${(detalles.estadisticas.totalFacturado || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-300">Total facturado</p>
                    </div>
                  </div>
                </div>
                
                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-300 text-sm">Total Consultas</p>
                    <p className="text-2xl font-bold text-blue-400">{detalles.estadisticas.totalConsultas}</p>
                    <p className="text-xs text-blue-300">
                      {detalles.estadisticas.consultasPorDia.toFixed(1)} por día promedio
                    </p>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-300 text-sm">Ganancia Total</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${(detalles.estadisticas.totalGanado || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-300">
                      ${Math.round(detalles.estadisticas.promedioPorConsulta * detalles.profesional.porcentaje / 100).toLocaleString()} promedio
                    </p>
                  </div>
                  
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <p className="text-purple-300 text-sm">Días Activos</p>
                    <p className="text-2xl font-bold text-purple-400">{detalles.estadisticas.diasActivos}</p>
                    <p className="text-xs text-purple-300">
                      de {detalles.estadisticas.diasTranscurridos} días totales
                    </p>
                  </div>
                  
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                    <p className="text-orange-300 text-sm">Método Preferido</p>
                    <p className="text-lg font-bold text-orange-400">
                      {detalles.estadisticas.metodosPreferidos.efectivo.porcentaje > 
                       detalles.estadisticas.metodosPreferidos.transferencia.porcentaje ? 
                       '💵 Efectivo' : '🏦 Transferencia'}
                    </p>
                    <p className="text-xs text-orange-300">
                      {Math.round(Math.max(
                        detalles.estadisticas.metodosPreferidos.efectivo.porcentaje,
                        detalles.estadisticas.metodosPreferidos.transferencia.porcentaje
                      ))}% de las veces
                    </p>
                  </div>
                </div>
                
                {/* Estado de deudas */}
                {(detalles.pendientes.efectivos > 0 || detalles.pendientes.transferencias > 0) && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <h4 className="font-semibold text-red-300 mb-3">⚠️ Deudas Pendientes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {detalles.pendientes.efectivos > 0 && (
                        <div>
                          <p className="text-orange-300 text-sm">Efectivos Pendientes</p>
                          <p className="text-xl font-bold text-orange-400">
                            ${(detalles.pendientes.efectivos || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-orange-300">
                            {detalles.pendientes.cantidadEfectivos} pagos pendientes
                          </p>
                        </div>
                      )}
                      {detalles.pendientes.transferencias > 0 && (
                        <div>
                          <p className="text-blue-300 text-sm">Comisiones Pendientes</p>
                          <p className="text-xl font-bold text-blue-400">
                            ${(detalles.pendientes.transferencias || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-blue-300">
                            {detalles.pendientes.cantidadTransferencias} transferencias
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Historial de pagos */}
                <div className="bg-black/30 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-300 mb-4">📋 Historial Completo de Pagos</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {detalles.pagosProfesional.map(pago => (
                      <div key={pago.id} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getEstadoColor(pago)}`}></div>
                          <div>
                            <p className="font-medium">{pago.paciente}</p>
                            <p className="text-xs text-gray-400">{pago.fecha} {pago.hora}</p>
                            {pago.comprobante && (
                              <p className="text-xs text-blue-400">📄 {pago.comprobante}</p>
                            )}
                            {pago.comprobanteClinica && (
                              <p className="text-xs text-green-400">✅ {pago.comprobanteClinica}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(pago.monto || 0).toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{pago.metodoPago}</p>
                          <p className="text-xs">
                            <span className="text-blue-400">+${(pago.gananciaProfesional || 0).toLocaleString()}</span>
                            {' / '}
                            <span className="text-purple-400">${(pago.gananciaClinica || 0).toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
};

export default Reportes; 
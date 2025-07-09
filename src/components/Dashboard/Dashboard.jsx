import React from 'react';
import { DollarSign, CreditCard, Calendar, FileImage, Check } from 'lucide-react';

const Dashboard = ({ stats, pagos, getEstadoColor }) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl border border-green-500/30 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-xs sm:text-sm font-medium">Efectivo Hoy</p>
              <p className="text-lg sm:text-2xl font-bold text-green-400">${(stats.totalEfectivoHoy || 0).toLocaleString()}</p>
              <p className="text-xs text-green-300 mt-1">Clínica cobra</p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl border border-blue-500/30 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-xs sm:text-sm font-medium">Transferencias Hoy</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-400">${(stats.totalTransferenciaHoy || 0).toLocaleString()}</p>
              <p className="text-xs text-blue-300 mt-1">Profesional cobra</p>
            </div>
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl border border-purple-500/30 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-xs sm:text-sm font-medium">Pagos Hoy</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-400">{stats.pagosHoy}</p>
              <p className="text-xs text-purple-300 mt-1">Total registrados</p>
            </div>
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </div>
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">Pagos Recientes</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {pagos.slice(-10).reverse().map(pago => (
            <div key={pago.id} className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${getEstadoColor(pago)}`}></div>
                <div>
                  <p className="font-semibold">{pago.profesionalNombre}</p>
                  <p className="text-sm text-gray-300">{pago.paciente} - {pago.fecha} {pago.hora}</p>
                  <p className="text-xs text-gray-400">
                    Estado: {pago.estado === 'pendiente' ? 'Pendiente' : 
                            pago.estado === 'pagado' ? 'Pagado' : 
                            pago.estado === 'recibida' ? 'Recibida' : 
                            'Completada'}
                  </p>
                  {pago.comprobante && (
                    <div className="flex items-center space-x-1 mt-1">
                      <FileImage className="w-3 h-3 text-blue-400" />
                      <p className="text-xs text-blue-400 truncate">Comprobante: {pago.comprobante}</p>
                    </div>
                  )}
                  {pago.comprobanteClinica && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Check className="w-3 h-3 text-green-400" />
                      <p className="text-xs text-green-400 truncate">Pago clínica: {pago.comprobanteClinica}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(pago.monto || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-400">{pago.metodoPago}</p>
                {pago.fechaPago && (
                  <p className="text-xs text-green-400">
                    Pagado: {new Date(pago.fechaPago).toLocaleDateString('es-AR')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
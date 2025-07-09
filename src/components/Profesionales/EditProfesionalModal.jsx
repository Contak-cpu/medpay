import React from 'react';
import { X, Save, User, Percent, DollarSign, Calendar } from 'lucide-react';

const EditProfesionalModal = ({ 
  profesional, 
  values, 
  errores, 
  onChange, 
  onSubmit, 
  onCancel, 
  loading 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-purple-500/30 p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Editar Profesional</h3>
              <p className="text-sm text-gray-300">Modifica los datos del profesional</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={values.nombre}
              onChange={(e) => onChange('nombre', e.target.value)}
              className={`w-full px-4 py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white ${
                errores.nombre ? 'border-red-500' : 'border-purple-500/30 focus:border-purple-400'
              }`}
              placeholder="Ej: Dr. Juan Pérez"
            />
            {errores.nombre && (
              <p className="text-red-400 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Especialidad
            </label>
            <input
              type="text"
              value={values.especialidad}
              onChange={(e) => onChange('especialidad', e.target.value)}
              className={`w-full px-4 py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white ${
                errores.especialidad ? 'border-red-500' : 'border-purple-500/30 focus:border-purple-400'
              }`}
              placeholder="Ej: Cardiología"
            />
            {errores.especialidad && (
              <p className="text-red-400 text-xs mt-1">{errores.especialidad}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Percent className="w-4 h-4" />
                  <span>Porcentaje (%)</span>
                </div>
              </label>
              <input
                type="number"
                value={values.porcentaje}
                onChange={(e) => onChange('porcentaje', e.target.value)}
                className={`w-full px-4 py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white ${
                  errores.porcentaje ? 'border-red-500' : 'border-purple-500/30 focus:border-purple-400'
                }`}
                placeholder="70"
                min="1"
                max="100"
              />
              {errores.porcentaje && (
                <p className="text-red-400 text-xs mt-1">{errores.porcentaje}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Valor Turno ($)</span>
                </div>
              </label>
              <input
                type="number"
                value={values.valorTurno}
                onChange={(e) => onChange('valorTurno', e.target.value)}
                className={`w-full px-4 py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white ${
                  errores.valorTurno ? 'border-red-500' : 'border-purple-500/30 focus:border-purple-400'
                }`}
                placeholder="15000"
                min="0"
              />
              {errores.valorTurno && (
                <p className="text-red-400 text-xs mt-1">{errores.valorTurno}</p>
              )}
            </div>
          </div>

          {/* Información calculada */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-purple-300">Información Calculada</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Ganancia por turno:</span>
                <span className="text-green-400 font-semibold">
                  ${values.valorTurno && values.porcentaje ? 
                    ((parseFloat(values.valorTurno) * parseFloat(values.porcentaje)) / 100).toLocaleString() : 
                    '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Comisión clínica:</span>
                <span className="text-purple-400 font-semibold">
                  ${values.valorTurno && values.porcentaje ? 
                    ((parseFloat(values.valorTurno) * (100 - parseFloat(values.porcentaje))) / 100).toLocaleString() : 
                    '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfesionalModal; 
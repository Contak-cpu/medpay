import React from 'react';

export default function AddProfesionalModal({ values, errores, onChange, onSubmit, onCancel, loading }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-4 sm:p-6 lg:p-8">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-purple-300">Nuevo Profesional</h3>
      <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Nombre Completo</label>
            <input
              type="text"
              value={values.nombre}
              onChange={e => onChange('nombre', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white text-sm sm:text-base ${errores.nombre ? 'border-red-500 focus:border-red-400' : 'border-purple-500/30 focus:border-purple-400'}`}
              placeholder="Dr. Juan Pérez"
              disabled={loading}
            />
            {errores.nombre && <p className="text-red-400 text-xs mt-1">{errores.nombre}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Especialidad</label>
            <input
              type="text"
              value={values.especialidad}
              onChange={e => onChange('especialidad', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white text-sm sm:text-base ${errores.especialidad ? 'border-red-500 focus:border-red-400' : 'border-purple-500/30 focus:border-purple-400'}`}
              placeholder="Cardiología"
              disabled={loading}
            />
            {errores.especialidad && <p className="text-red-400 text-xs mt-1">{errores.especialidad}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Porcentaje del Profesional (%)</label>
            <input
              type="number"
              value={values.porcentaje}
              onChange={e => onChange('porcentaje', e.target.value)}
              className={`w-full px-4 py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white ${errores.porcentaje ? 'border-red-500 focus:border-red-400' : 'border-purple-500/30 focus:border-purple-400'}`}
              placeholder="70"
              min="1"
              max="100"
              disabled={loading}
            />
            {errores.porcentaje && <p className="text-red-400 text-xs mt-1">{errores.porcentaje}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Valor del Turno</label>
            <input
              type="number"
              value={values.valorTurno}
              onChange={e => onChange('valorTurno', e.target.value)}
              className={`w-full px-4 py-3 bg-black/30 border rounded-xl focus:outline-none transition-colors text-white ${errores.valorTurno ? 'border-red-500 focus:border-red-400' : 'border-purple-500/30 focus:border-purple-400'}`}
              placeholder="2000"
              min="1"
              disabled={loading}
            />
            {errores.valorTurno && <p className="text-red-400 text-xs mt-1">{errores.valorTurno}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="bg-gray-600/20 hover:bg-gray-600/40 px-4 py-2 rounded-xl text-gray-200"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-xl text-white font-semibold"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
} 
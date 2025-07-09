import React from 'react';

export default function AddPagoModal({ values, errores, profesionales, onChange, onSubmit, onCancel, loading }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-4 sm:p-6 lg:p-8 max-w-lg w-full">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-purple-300">Registrar Pago</h3>
      <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Profesional</label>
          <select
            value={values.profesionalId}
            onChange={e => onChange('profesionalId', e.target.value)}
            className={`w-full px-3 py-2 bg-black/30 border rounded-xl focus:outline-none text-white ${errores.profesionalId ? 'border-red-500' : 'border-purple-500/30'}`}
            disabled={loading}
          >
            <option value="">Seleccionar profesional</option>
            {profesionales.map(prof => (
              <option key={prof.id} value={prof.id}>{prof.nombre}</option>
            ))}
          </select>
          {errores.profesionalId && <p className="text-red-400 text-xs mt-1">{errores.profesionalId}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Paciente</label>
          <input
            type="text"
            value={values.paciente}
            onChange={e => onChange('paciente', e.target.value)}
            className={`w-full px-3 py-2 bg-black/30 border rounded-xl focus:outline-none text-white ${errores.paciente ? 'border-red-500' : 'border-purple-500/30'}`}
            placeholder="Nombre del paciente"
            disabled={loading}
          />
          {errores.paciente && <p className="text-red-400 text-xs mt-1">{errores.paciente}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Método de Pago</label>
            <select
              value={values.metodoPago}
              onChange={e => onChange('metodoPago', e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border rounded-xl focus:outline-none text-white border-purple-500/30"
              disabled={loading}
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Monto</label>
            <input
              type="number"
              value={values.monto}
              onChange={e => onChange('monto', e.target.value)}
              className={`w-full px-3 py-2 bg-black/30 border rounded-xl focus:outline-none text-white ${errores.monto ? 'border-red-500' : 'border-purple-500/30'}`}
              placeholder="0"
              min="1"
              disabled={loading}
            />
            {errores.monto && <p className="text-red-400 text-xs mt-1">{errores.monto}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Fecha</label>
            <input
              type="date"
              value={values.fecha}
              onChange={e => onChange('fecha', e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border rounded-xl focus:outline-none text-white border-purple-500/30"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Hora</label>
            <input
              type="time"
              value={values.hora}
              onChange={e => onChange('hora', e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border rounded-xl focus:outline-none text-white border-purple-500/30"
              disabled={loading}
            />
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
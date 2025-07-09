import React from 'react';
import { User, Edit, Trash2, Eye, DollarSign, Percent, Calendar } from 'lucide-react';

export default function ProfesionalesList({ profesionales, onSelect, onEdit, onDelete }) {
  if (!profesionales || profesionales.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay profesionales</h3>
        <p className="text-gray-400">Agrega tu primer profesional para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profesionales.map(prof => (
        <div 
          key={prof.id} 
          className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all transform hover:scale-[1.02] group"
        >
          {/* Header con avatar */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                {prof.nombre}
              </h3>
              <p className="text-sm text-gray-300">{prof.especialidad}</p>
            </div>
          </div>

          {/* Información del profesional */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <Percent className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Porcentaje:</span>
              <span className="text-sm font-semibold text-blue-400">{prof.porcentaje}%</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Valor turno:</span>
              <span className="text-sm font-semibold text-green-400">${prof.valor_turno?.toLocaleString()}</span>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Ganancia por turno:</span>
              <span className="text-sm font-semibold text-purple-400">
                ${((prof.valor_turno * prof.porcentaje) / 100)?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-2">
            <button
              className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 px-3 py-2 rounded-xl text-blue-300 text-sm font-medium transition-all flex items-center justify-center space-x-2 group"
              onClick={() => onSelect && onSelect(prof)}
            >
              <Eye className="w-4 h-4" />
              <span>Ver Detalle</span>
            </button>
            
            <button
              className="flex-1 bg-green-600/20 hover:bg-green-600/40 px-3 py-2 rounded-xl text-green-300 text-sm font-medium transition-all flex items-center justify-center space-x-2 group"
              onClick={() => onEdit && onEdit(prof)}
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
            
            <button
              className="flex-1 bg-red-600/20 hover:bg-red-600/40 px-3 py-2 rounded-xl text-red-300 text-sm font-medium transition-all flex items-center justify-center space-x-2 group"
              onClick={() => onDelete && onDelete(prof.id)}
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 
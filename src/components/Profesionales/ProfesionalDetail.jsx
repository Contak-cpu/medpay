import React from 'react';

export default function ProfesionalDetail({ profesional, estadisticas, onClose }) {
  if (!profesional) return null;
  return (
    <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-purple-300">Detalle del Profesional</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-red-400 text-lg font-bold">×</button>
      </div>
      <div className="space-y-2 mb-4">
        <p><span className="font-semibold text-purple-200">Nombre:</span> {profesional.nombre}</p>
        <p><span className="font-semibold text-purple-200">Especialidad:</span> {profesional.especialidad}</p>
        <p><span className="font-semibold text-purple-200">Porcentaje:</span> {profesional.porcentaje}%</p>
        <p><span className="font-semibold text-purple-200">Valor Turno:</span> ${profesional.valor_turno}</p>
      </div>
      {estadisticas && (
        <div className="bg-purple-900/10 rounded-xl p-4">
          <h4 className="font-semibold text-purple-300 mb-2">Estadísticas</h4>
          <ul className="text-sm text-purple-100 space-y-1">
            <li>Total Consultas: {estadisticas.totalConsultas}</li>
            <li>Total Facturado: ${estadisticas.totalFacturado}</li>
            <li>Total Ganado: ${estadisticas.totalGanado}</li>
            <li>Total Comisiones: ${estadisticas.totalComisiones}</li>
            <li>Promedio por Consulta: ${estadisticas.promedioPorConsulta.toFixed(2)}</li>
            <li>Días Activos: {estadisticas.diasActivos}</li>
            <li>Días Transcurridos: {estadisticas.diasTranscurridos}</li>
            <li>Consultas por Día: {estadisticas.consultasPorDia.toFixed(2)}</li>
            <li>Efectivo: {estadisticas.metodosPreferidos.efectivo.cantidad} (${estadisticas.metodosPreferidos.efectivo.monto})</li>
            <li>Transferencia: {estadisticas.metodosPreferidos.transferencia.cantidad} (${estadisticas.metodosPreferidos.transferencia.monto})</li>
          </ul>
        </div>
      )}
    </div>
  );
} 